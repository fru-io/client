import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { GetSitesClient } from '../../../internal/config/config';
import * as grpc from '@grpc/grpc-js'
import { BackupDatabaseRequest, BackupDatabaseResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';

const client = GetSitesClient()

interface Props {
	req: BackupDatabaseRequest
	meta: grpc.Metadata
}

export const DefaultComponent: FC<Props> = (props) => {
	const [resp, setResp] = useState<BackupDatabaseResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.backupDatabase(props.req, props.meta, (error: grpc.ServiceError | null, value?: BackupDatabaseResponse) => {
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
					<Box paddingLeft={2} paddingRight={2} key={resp.getBackup().getName()}><Text color="white">Name: </Text><Text color="green">{resp.getBackup().getName()}</Text></Box>
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
	const [resp, setResp] = useState<BackupDatabaseResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.backupDatabase(props.req, props.meta, (error: grpc.ServiceError | null, value?: BackupDatabaseResponse) => {
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