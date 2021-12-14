#!/usr/bin/env node
import * as program from 'commander';

import * as grpc from '@grpc/grpc-js'

import { refreshToken } from '../../auth/cli';
import { GetSitesClient } from '../../internal/config/config';
import { RestoreFilesRequest, RestoreFilesResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

const client = GetSitesClient()

const restore = new program.Command('restore <name>')
  .command('restore <name>')
  .description('restore files from a staging area')
  .action( async (name: string) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    console.log({
      name,
      meta,
    })
    const req = new RestoreFilesRequest()
    req.setName(name)
    const promiseResonse = new Promise<void>( (resolve) => {
      client.restoreFiles(req, meta, (error: grpc.ServiceError | null, response?: RestoreFilesResponse) => {
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

export default restore