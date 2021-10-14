import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { SetDefaultWorkspaceRequest, SetDefaultWorkspaceResponse } from '@fru-io/fru-apis/live/administration/v1alpha1/workspace_pb';
import { GetAdminClient } from '../../internal/config/config';
import * as grpc from '@grpc/grpc-js'

const client = GetAdminClient()

interface Props {
	req: SetDefaultWorkspaceRequest
	meta: grpc.Metadata
}

export const DefaultComponent: FC<Props> = (props) => {

	const [resp, setResp] = useState<SetDefaultWorkspaceResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.setDefaultWorkspace(props.req, props.meta, (error: grpc.ServiceError | null, value?: SetDefaultWorkspaceResponse) => {
				if (error) {
					setError(error)
				}
				setResp(value)
			})
		}
		// Execute the created function directly
		init();
	  }, [props]);

	  if (err) {
		return (
			<Box flexDirection="column">
				<Box flexDirection="column" key="message"><Text color="white" backgroundColor="red">{err.message}</Text></Box>
			</Box>
		)
	  }
	  if (resp && resp.getWorkspace()) {
		  return (
			  <Box>
			  <Box><Text color="white">Selected Workspace: </Text><Text color="green">{resp.getWorkspace().getSubscription()}.{resp.getWorkspace().getName()}</Text></Box>
			  </Box>
		  )
	  } 

	  return (
		  <>
		  </>
	  )
}

export const JSONComponent: FC<Props> = (props) => {
	const {write} = useStdout();
	const [resp, setResp] = useState<SetDefaultWorkspaceResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.setDefaultWorkspace(props.req, props.meta, (error: grpc.ServiceError | null, value?: SetDefaultWorkspaceResponse) => {
				if (error) {
					setError(error)
				}
				setResp(value)
			})
		}
		// Execute the created function directly
		init();
	  }, [props]);

	  if (err) {
		write(JSON.stringify(err))
		return null
	  }
	  if (resp && resp.getWorkspace()) {
		write(JSON.stringify(resp.toObject()))
		return null
	  } 

	  return null
}