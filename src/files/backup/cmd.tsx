#!/usr/bin/env node
import * as program from 'commander';
import { BackupFilesRequest, BackupFilesResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

import * as grpc from '@grpc/grpc-js'
import { refreshToken } from '../../auth/cli';
import { GetSitesClient } from '../../internal/config/config';

const client = GetSitesClient()

const backup = new program.Command('backup <site>')
  .command('backup <site>')
  .description('backup files into a staging area')
  .action( async (site: string) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)
    
    const req = new BackupFilesRequest()
    req.setSite(site)
    const promiseResonse = new Promise<void>( (resolve) => {
      client.backupFiles(req, meta, (error: grpc.ServiceError | null, response?: BackupFilesResponse) => {
        if (error) {
          console.log({
            error,
          })
        }
        if (response) {
          console.log({
            name: response.getName(),
          })
        }
        resolve()
      })
    })
    await promiseResonse
  })

export default backup