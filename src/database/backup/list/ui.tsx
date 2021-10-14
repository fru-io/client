import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { GetSitesClient } from '../../../internal/config/config';
import * as grpc from '@grpc/grpc-js'
import { BackupState, DatabaseBackupMetadata, ListDatabaseBackupsRequest, ListDatabaseBackupsResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';

const client = GetSitesClient()

interface Props {
	req: ListDatabaseBackupsRequest
	meta: grpc.Metadata
}

function getStateName(state:number):string {
	switch(state) {
		case BackupState.CREATED: return "IN PROGRESS";
		case BackupState.DELETED: return "DELETED";
		case BackupState.FINISHED: return "FINISHED";
	}
	return "unknown"
}

export const DefaultComponent: FC<Props> = (props) => {
	const [resp, setResp] = useState<ListDatabaseBackupsResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.listDatabaseBackups(props.req, props.meta, (error: grpc.ServiceError | null, value?: ListDatabaseBackupsResponse) => {
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
					  resp.getBackupList().map( (meta:DatabaseBackupMetadata, index:number) => (
						<Box borderStyle="round" flexDirection="column" key={index}>
							<Box paddingLeft={0} paddingRight={2} paddingBottom={1} key={meta.getName()}><Text color="white">Created: </Text><Text color="green">{meta.getName()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={meta.getCreated()}><Text color="white">Created: </Text><Text color="green">{new Date(meta.getCreated() * 1000).toUTCString()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={meta.getState()}><Text color="white">State: </Text><Text color="green">{getStateName(meta.getState())}</Text></Box>
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
	const [resp, setResp] = useState<ListDatabaseBackupsResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.listDatabaseBackups(props.req, props.meta, (error: grpc.ServiceError | null, value?: ListDatabaseBackupsResponse) => {
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