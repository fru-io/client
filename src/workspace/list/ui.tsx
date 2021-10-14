import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { ListWorkspaceRequest, ListWorkspaceResponse, Workspace } from '@fru-io/fru-apis/live/administration/v1alpha1/workspace_pb';
import { GetAdminClient } from '../../internal/config/config';
import * as grpc from '@grpc/grpc-js'

const client = GetAdminClient()

interface Props {
	req: ListWorkspaceRequest
	meta: grpc.Metadata
}

export const DefaultComponent: FC<Props> = (props) => {
	const [resp, setResp] = useState<ListWorkspaceResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.listWorkspaces(props.req, props.meta, (error: grpc.ServiceError | null, value?: ListWorkspaceResponse) => {
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
	  if (resp) {
		  return (
			  <Box>
				  {
					resp.getWorkspacesList().map( (ws:Workspace, index:number) => (
						<Box key={index} borderStyle="round" flexDirection="column">
							<Box paddingLeft={2} paddingRight={2} key={ws.getSubscription()}><Text color="white">Subscription: </Text><Text color="green">{ws.getSubscription()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={ws.getName()}><Text color="white">Name: </Text><Text color="green">{ws.getName()}</Text></Box>
							<Box paddingLeft={2} flexDirection="column" key="admins"><Text color="white">Admins: </Text>
							{
								ws.getAdminsList().map( (admin:string, index:number) => (
									<Box paddingLeft={4} paddingRight={2} key={index}><Text color="green">- {admin}</Text></Box>
									)
								)
							}
							</Box>
						</Box>
					))
				  }
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
	const [resp, setResp] = useState<ListWorkspaceResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.listWorkspaces(props.req, props.meta, (error: grpc.ServiceError | null, value?: ListWorkspaceResponse) => {
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
	  if (resp) {
		write(JSON.stringify(resp.toObject()))
		return null
	  } 

	  return null
}