import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { GetSitesClient } from '../../internal/config/config';
import * as grpc from '@grpc/grpc-js'
import { DescribeFileBackupRequest, DescribeFileBackupResponse, File } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

const client = GetSitesClient()

interface Props {
	req: DescribeFileBackupRequest
	meta: grpc.Metadata
}

export const DefaultComponent: FC<Props> = (props) => {
	const [resp, setResp] = useState<DescribeFileBackupResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.describeFileBackup(props.req, props.meta, (error: grpc.ServiceError | null, value?: DescribeFileBackupResponse) => {
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
					resp.getMetadataList().map( (f:File, index:number) => (
						<Box key={index} borderStyle="round" flexDirection="column">
							<Box paddingLeft={2} paddingRight={2} key={f.getPath()}><Text color="white">Path: </Text><Text color="green">{f.getPath()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={f.getMd5()}><Text color="white">Name: </Text><Text color="green">{f.getMd5()}</Text></Box>
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
	const [resp, setResp] = useState<DescribeFileBackupResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.describeFileBackup(props.req, props.meta, (error: grpc.ServiceError | null, value?: DescribeFileBackupResponse) => {
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