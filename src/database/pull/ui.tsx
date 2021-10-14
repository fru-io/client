import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { ListWorkspaceRequest, ListWorkspaceResponse, Workspace } from '@fru-io/fru-apis/live/administration/v1alpha1/workspace_pb';
import { GetConfig } from '../../internal/config/config';
import * as grpc from '@grpc/grpc-js'
import { DatabaseBackup, DatabaseBackupMetadata, DatabaseBackupMetadataRequest, PullDatabaseBackupRequest, PullDatabaseBackupResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';
import { SitesClient } from '@fru-io/fru-apis/live/sites/v1alpha1/service_grpc_pb';

import fs from 'fs'

const creds = grpc.ChannelCredentials.createInsecure()
let host:string = GetConfig().host
if (process.env.API_HOST) {
    host = process.env.API_HOST
}
const client = new SitesClient(host, creds)

interface Props {
	metaReq: DatabaseBackupMetadataRequest
	req: PullDatabaseBackupRequest
	meta: grpc.Metadata
}

interface StreamState {
	metadata: DatabaseBackupMetadata
	stream: grpc.ClientReadableStream<PullDatabaseBackupResponse>
}

export const DefaultComponent: FC<Props> = (props) => {
	const [state, setState] = useState<StreamState>()
	const [written, setWritten] = useState<number>(0)
	const [err, setError] = useState<grpc.ServiceError>()

	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			const metadataPromise = new Promise<DatabaseBackupMetadata>( (resolve, reject) => {
				client.databaseBackupMeta(props.metaReq, props.meta, (err: grpc.ServiceError, value?: DatabaseBackupMetadata) => {
				  if (err) {
					reject(err)
				  }
				  resolve(value)
				})
			})
			const meta = await metadataPromise

			const stream = client.pullDatabaseBackupStream(props.req, props.meta)

			setState({
				metadata: meta,
				stream: stream,
			})
		}
		// Execute the created function directly
		init();
	  }, [props]);

	  useEffect(() => {
		if (state && state.stream) {
			state.stream.on('data', (response: PullDatabaseBackupResponse) => {
				const f = response.getBackup()
				if (f) {
				  const filename = f.getMetadata().getName()
				  const fd = fs.openSync(filename, 'a')
				  fs.appendFileSync(fd, f.getContent())
				  setWritten((old) => old + f.getContent().length)
				}
			})
		}
	  }, [state])

	  if (err) {
		return (
			<Box flexDirection="column">
				<Box flexDirection="column" key="message"><Text color="white" backgroundColor="red">{err.message}</Text></Box>
			</Box>
		)
	  }
	  if (state) {
		  const total = state.metadata.getSize()
		  return (
			  <Box borderStyle="round">
					<Box paddingLeft={2} paddingRight={4} flexDirection="column" key={state.metadata.getName()}>
						<Text color="white">{state.metadata.getName()}</Text>
					</Box>
					<Box paddingLeft={4} paddingRight={4} >
						<Text color="white">{written}/{total}</Text>
					</Box>
					<Box paddingLeft={4} paddingRight={4} >
						<Text color="green">{Math.round( written/total*100 )}%</Text>
					</Box>
			  </Box>
		  )
	  } 

	  return (
		  <>
		  </>
	  )
}

// export const JSONComponent: FC<Props> = (props) => {
// 	const {write} = useStdout();
// 	const [resp, setResp] = useState<ListWorkspaceResponse>()
// 	const [err, setError] = useState<grpc.ServiceError>()
// 	useEffect(() => {
// 		// Create an scoped async function in the hook
// 		async function init() {
// 		}
// 		// Execute the created function directly
// 		init();
// 	  }, [props]);

// 	  if (err) {
// 		write(JSON.stringify(err))
// 		return null
// 	  }
// 	  if (resp) {
// 		write(JSON.stringify(resp.toObject()))
// 		return null
// 	  } 

// 	  return null
// }