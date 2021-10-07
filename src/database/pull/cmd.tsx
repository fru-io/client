#!/usr/bin/env node
// import React from 'react';
// import {render} from 'ink';
import * as program from 'commander';
import { SitesClient } from '@fru-io/fru-apis/live/sites/v1alpha1/service_grpc_pb'
import * as grpc from '@grpc/grpc-js'
import * as depGrpc from 'grpc'
import { DatabaseBackup, PullDatabaseBackupRequest, PullDatabaseBackupResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';
import { refreshToken } from '../../auth/cli';

import fs from 'fs'

const creds = grpc.ChannelCredentials.createInsecure()
const client = new SitesClient('localhost:8080',creds as grpc.ChannelCredentials)

const pull = new program.Command('pull <name> <site> <path>')
  .command('pull <name>')
  .description('retrieve a database')
  .action( async (name: string) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const req = new PullDatabaseBackupRequest()
    req.setBackup(name)

    try {
      const stream : depGrpc.ClientReadableStream<PullDatabaseBackupRequest> = client.pullDatabaseBackupStream(req, meta)
      let promises: Promise<DatabaseBackup>[] = []
      stream.on('data', (response: PullDatabaseBackupResponse) => {
        promises = promises.concat(new Promise<DatabaseBackup>( (resolve) => {
          const f = response.getBackup()
          if (f) {
            const filename = f.getMetadata().getName()
            const fd = fs.openSync(filename, 'wa')
            fs.appendFileSync(fd, f.getContent())
            resolve(f)
          }
        }))
      })
      const serverClose = new Promise<boolean>( (resolve) => {
        stream.on('close', async () => {
          console.log({
            event: 'close',
          })
          resolve(true)
        })
      })
      await serverClose
      await Promise.all(promises)

    } catch ( e ) {
      console.log({
        e,
      })
    }
  })

export default pull