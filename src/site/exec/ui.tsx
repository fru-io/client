import React, {FC, useState} from 'react';
import * as grpc from '@grpc/grpc-js'
import { SiteExecRequest, SiteExecResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/site_pb';
import {Box, Text, useStdin,useStdout,useInput, useStderr} from 'ink';
import { GetSitesClient } from '../../internal/config/config';


interface Props {
	site: string
	meta: grpc.Metadata
	command:string
	interactive:boolean
}

const client = GetSitesClient()

const newRequest = (props:Props, command:string): SiteExecRequest => {
	const r = new SiteExecRequest()
	r.setCommandList(command.split(' '))
	r.setInteractive(props.interactive)
	r.setName(props.site)
	return r
}
  
export const DefaultComponent: FC<Props> = (props) => {

	// ************************
	// TODO:  CURRENTLY UNUSED
	// ************************

	const {stdin} = useStdin();
	const [buf, setbuf] = useState("")
	// TODO: RING BUFFER
	const [output, setOutput] = useState("")
	const [err, setErr] = useState("")
	const stream = client.siteExecStream(props.meta)
	
	const {write:error} = useStderr();
	const {write} = useStdout();
	const decoder = new TextDecoder()
	stream.on('data', (chunk: SiteExecResponse) => {
		if ( chunk.getStdout() ) {
			const outputData:string = decoder.decode(chunk.getStdout() as Uint8Array)
			// write(outputData)
			setOutput(outputData)
		}
		if ( chunk.getStderr() ) {
			const errData:string = decoder.decode(chunk.getStderr() as Uint8Array)
			// error(errData)
		}
	})
	// execute the entry command
	const r = newRequest(props, props.command)
	stream.write(r)

	if ( props.interactive ) {
		// if interactive stream input
		useInput(async (input, key) => {
			// console.log(input)
			if ( key.return ) {
				// Parse the command string
				const cmd = buf.split(' ')
				const req = new SiteExecRequest()
				req.setName(props.site)
				req.setInteractive(true)
				req.setCommandList(cmd)
				setbuf("")
				try{
					stream.write(req)
				}
				catch (e){
					error(e)
				}
			} else {
				setbuf(buf.concat(input))
			}
		})
	}

	return (
		<>
		<Text color="green" >{output}</Text>
		<Box key="input" flexDirection="column" borderStyle="round" paddingLeft={0} paddingRight={0} paddingBottom={0}>
			<Text>{buf}</Text>
		</Box>
		</>
	)
}