import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { GetSitesClient } from '../../internal/config/config';
import * as grpc from '@grpc/grpc-js'
import { File, PullFileBackupRequest, PullFileBackupResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

import fs from 'fs'
import os from 'os'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const client = GetSitesClient()

interface Props {
	req: PullFileBackupRequest
	meta: grpc.Metadata
	writeDir: string
}

interface ScratchFile {
	name: string
	path: string
	written: number
	total: number
}

interface StreamState {
	stream: grpc.ClientReadableStream<PullFileBackupResponse>
	streamInit: boolean
	scratchMap: Map<String, ScratchFile>
	scratchDir: string
}

export const DefaultComponent: FC<Props> = (props) => {
	const [state, setState] = useState<StreamState>({
		stream: undefined,
		streamInit: false,
		scratchMap: new Map<String, ScratchFile>(),
		scratchDir: os.tmpdir().concat("/fru-", uuidv4()),
	})
	const [err, setError] = useState<grpc.ServiceError>()

	useEffect(() => {

		// redefine this function each time scratchMap changes
		const handleFileResp = (response: PullFileBackupResponse) => {
			const f = response.getFile()
			if (f) {
				const writePath = state.scratchDir.concat("/" + f.getPath())
		
				try {
					fs.appendFileSync(writePath, f.getContent())
				} catch (e) {
					console.log(e)
				}
				// Update progress
				const key = f.getPath()
				if (state.scratchMap.has(key)) {
					const sf = state.scratchMap.get(key)
					sf.written = sf.written + f.getContent().length
					state.scratchMap.set(key, sf)
					setState({
						scratchMap: state.scratchMap,
						stream: state.stream,
						streamInit: state.streamInit,
						scratchDir: state.scratchDir,
					})
				} else {
					const sf: ScratchFile = {
						name: f.getPath(),
						path: writePath,
						total: f.getTotal(),
						written: f.getContent().length
					}
					state.scratchMap.set(key, sf)
					setState({
						scratchMap: state.scratchMap,
						stream: state.stream,
						streamInit: state.streamInit,
						scratchDir: state.scratchDir
					})
				}
			}
		}
	
		const finalize = () => {
			// Move all scratch files to the dest directory
			if (! fs.existsSync(props.writeDir)) {
				fs.mkdirSync(props.writeDir, { recursive: true })
			}
			state.scratchMap.forEach( (f: ScratchFile) => {
				const base = path.basename(f.name)
				fs.rename(f.path, path.join(props.writeDir, base), (err) => {
					console.log(err)
				})
			})
			if (fs.existsSync(state.scratchDir)) {
				fs.rmdir(state.scratchDir, (err) => {
					console.log(err)
				})
			}
		}

		// Create an scoped async function in the hook
		async function init() {
			try {
			
				// Initialize the stream once
				if (state && !state.streamInit) {

					if (!fs.existsSync(state.scratchDir)) {
						console.log(state.scratchDir)
						fs.mkdirSync(state.scratchDir)
					}

					const stream = client.pullFileBackupStream(props.req, props.meta)
					// This Listener Shall be set up only once!
					stream.on('data', (response: PullFileBackupResponse) => {
						handleFileResp(response)
					})
					stream.on('close', async () => {
						finalize()
					})
					setState({
						scratchMap: state.scratchMap,
						stream: stream,
						streamInit: true,
						scratchDir: state.scratchDir,
					})
				}
			} catch (e) {
				setError(e)
				if (fs.existsSync(state.scratchDir)) {
					fs.rmdir(state.scratchDir, (err) => {
						console.log(err)
					})
				}
			}
		}
		// Execute the created function directly
		init();
	}, [props, state]);

	if (err) {
		return (
			<Box flexDirection="column">
				<Box flexDirection="column" key="message"><Text color="white" backgroundColor="red">{err.message}</Text></Box>
			</Box>
		)
	}
	if (state) {
		return (
			<Box borderStyle="round" flexDirection="column" >
				{
				[...state.scratchMap.keys()].map( (key: string) => (
					<Box paddingLeft={2} paddingRight={4} key={key}>
						<Text color="white">{state.scratchMap.get(key).name}:   </Text><Text color="green">{state.scratchMap.get(key).written}/{state.scratchMap.get(key).total}   ({Math.round( state.scratchMap.get(key).written/state.scratchMap.get(key).total*100 )}%)</Text>
					</Box>
				)
				)
				}
			</Box>
		)
	} 

	return (
		<>
		</>
	)
}