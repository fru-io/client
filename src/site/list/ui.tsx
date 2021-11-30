import React, {FC, useEffect, useState} from 'react';
import {Box, Text, useStdout} from 'ink';
import { ListSiteRequest, ListSiteResponse, Site, SiteType } from '@fru-io/fru-apis/live/sites/v1alpha1/site_pb';
import { GetSitesClient } from '../../internal/config/config';
import * as grpc from '@grpc/grpc-js'

const client = GetSitesClient()

interface Props {
	req: ListSiteRequest
	meta: grpc.Metadata
}

export const DefaultComponent: FC<Props> = (props) => {
	const [resp, setResp] = useState<ListSiteResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.listSites(props.req, props.meta, (error: grpc.ServiceError | null, value?: ListSiteResponse) => {
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
			  <Box flexDirection="column">
				  {
					resp.getSitesList().map( (site:Site, index:number) => (
						<Box key={index} borderStyle="round" flexDirection="column">
							<Box paddingLeft={2} paddingRight={2} key={site.getName()}><Text color="white">Name: </Text><Text color="green">{site.getName()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={site.getWorkspace()}><Text color="white">Workspace: </Text><Text color="green">{site.getWorkspace()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={site.getGit().getUrl()}><Text color="white">Repository: </Text><Text color="green">{site.getGit().getUrl()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={site.getGit().getRef()}><Text color="white">Reference: </Text><Text color="green">{site.getGit().getRef()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={site.getCreationtime()}><Text color="white">Created: </Text><Text color="green">{site.getCreationtime()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key={site.getPhpversion()}><Text color="white">PHP Version: </Text><Text color="green">{site.getPhpversion()}</Text></Box>
							<Box paddingLeft={2} paddingRight={2} key="DocRootHead"><Text color="white">Docroot: </Text><Text color="green">{site.getDocroot()}</Text></Box>
							{
								site.getComposerinstall() ?
								    <>
									<Box paddingLeft={2} paddingRight={2} key="ComposerHead"><Text color="white">Composer: </Text></Box>
									{
										site.getComposerargsList().map( (arg:string, index:number) => (
											<Box paddingLeft={4} paddingRight={2} key={index}><Text color="green">- {arg}</Text></Box>
											)
										)
									} 
									</>
									: 
									<></>
							}
							<Box paddingLeft={2} paddingRight={2} key="URLsHead"><Text color="white">URL's: </Text></Box>
							{
								site.getUrlsList().map( (url:string, index:number) => (
									<Box paddingLeft={4} paddingRight={2} key={index}><Text color="green">- {url}</Text></Box>
									)
								)
							}
							<Box paddingLeft={2} paddingRight={2} key={site.getStatus().toString()}><Text color="white">Status: </Text></Box>
							<Box paddingLeft={4} paddingRight={2} key="database"><Text color="white">Database: </Text><Text color="green">{site.getStatus().getDatabase() ? "TRUE" : "FALSE"}</Text></Box>
							<Box paddingLeft={4} paddingRight={2} key="filestore"><Text color="white">Filestore: </Text><Text color="green">{site.getStatus().getFilestore() ? "TRUE" : "FALSE"}</Text></Box>
							<Box paddingLeft={4} paddingRight={2} key="server"><Text color="white">Server: </Text><Text color="green">{site.getStatus().getServer() ? "TRUE" : "FALSE"}</Text></Box>
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
	const [resp, setResp] = useState<ListSiteResponse>()
	const [err, setError] = useState<grpc.ServiceError>()
	useEffect(() => {
		// Create an scoped async function in the hook
		async function init() {
			client.listSites(props.req, props.meta, (error: grpc.ServiceError | null, value?: ListSiteResponse) => {
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