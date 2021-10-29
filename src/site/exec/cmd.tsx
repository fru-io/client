#!/usr/bin/env node
import * as program from 'commander';
// import App from './ui';
import * as grpc from '@grpc/grpc-js'

import { refreshToken } from '../../auth/cli';
import { SiteExecRequest, SiteExecResponse, Site, SiteType } from '@fru-io/fru-apis/live/sites/v1alpha1/site_pb';
import { GetSitesClient } from '../../internal/config/config';

import readline from 'readline'

const client = GetSitesClient()

const newRequest = (interactive:boolean, site:string, command:string): SiteExecRequest => {
	const r = new SiteExecRequest()
	r.setCommandList(command.split(' '))
	r.setInteractive(interactive)
	r.setName(site)
	return r
}

const list = new program.Command('exec <site> <command>')
  .command('exec <site> <command>')
  .description('execute commands in a single site')
  .action( async (site: string, command: string, args: any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    var interactive = false
    if ( args.i || args.interactive ) {
      interactive = true
    }

    const stream = client.siteExecStream(meta)
    const decoder = new TextDecoder()
    stream.on('data', (chunk: SiteExecResponse) => {
      if ( chunk.getStdout() ) {
        const outputData:string = decoder.decode(chunk.getStdout() as Uint8Array)
        process.stdout.write(outputData)
      }
      if ( chunk.getStderr() ) {
        const errData:string = decoder.decode(chunk.getStderr() as Uint8Array)
        process.stdout.write(errData)
      }
    })
    const r = newRequest(interactive, site, command)
    stream.write(r)

	  if ( interactive ) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });
      
      rl.on('line', function(line){
        const r = newRequest(interactive, site, line)
        stream.write(r)
      })
    }

    const reqPromise = new Promise<void>( (resolve, reject) => {
    })
    try {
      await reqPromise
    } catch ( e ) {
      console.log("Connection Terminated")
    }
  })

list.option("-i|--interactive", "indicates that the command stream shall be left open if the command accepts additional terminal input", false)

export default list