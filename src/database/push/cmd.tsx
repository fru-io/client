#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import * as program from 'commander';
import { DatabaseC } from './ui';
import { SitesClient } from '@fru-io/fru-apis/live/sites/v1alpha1/service_grpc_pb'
import * as grpc from '@grpc/grpc-js'
import * as depGrpc from 'grpc'

const creds = grpc.ChannelCredentials.createInsecure()
const client = new SitesClient('localhost:8080',creds as grpc.ChannelCredentials)

import fs from 'fs'

import { refreshToken } from '../../auth/cli';
import { DatabaseBackup, DatabaseBackupMetadata, PushDatabaseBackupRequest, PushDatabaseBackupResponse, RestoreDatabaseRequest, RestoreDatabaseResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';

const push = new program.Command('push <name> <site> <path>')
  .command('push <name> <site> <path>')
  .description('upload a database')
  .action( async (name: string, site: string, path: string) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)
    const stream : depGrpc.ClientWritableStream<PushDatabaseBackupRequest> = client.pushDatabaseBackupStream(meta, (error: depGrpc.ServiceError | null, response?: PushDatabaseBackupResponse) => {
      console.log({
        response,
        error,
      })
      if ( response ) {
        const restoreReq = new RestoreDatabaseRequest()
        restoreReq.setSite(site)
        restoreReq.setBackup(response.getBackup())
        client.restoreDatabase(restoreReq, meta, (error: depGrpc.ServiceError | null, response?: RestoreDatabaseResponse) => {
          if ( error ) {
            console.log(error.message)
            process.exit(1)
          }
          console.log("created database backup restore operation: " + response?.getBackup())
        })
      }
    }).on("error", (err: Error) => {
      console.log({
        err,
      })
    })

    const readable = fs.createReadStream(path)
    const readPromise = new Promise<void>( (resolve) => {
      readable.on('end', () => {
        resolve()
      })
    })
    let promises: Promise<void>[] = []
    readable.on("data", chunk => {
      promises.concat(new Promise<void>( (resolve) => {
        const backup = new DatabaseBackup()
        backup.setContent(chunk)
    
        const backupMeta = new DatabaseBackupMetadata()
        backupMeta.setName(name)
        backup.setMetadata(backupMeta)
    
        const req = new PushDatabaseBackupRequest()
        req.setSite(site)
        req.setBackup(backup)
        stream.write(req, () => {
          render(
            <DatabaseC name={path} />
          );
          resolve()
        })
      }))
    });

    await readPromise
    await Promise.all(promises)

    stream.end()
  })

export default push