#!/usr/bin/env node
import * as program from 'commander';
import { SitesClient } from '@fru-io/fru-apis/live/sites/v1alpha1/service_grpc_pb'
// import { CreateTokenRequest, CreateTokenResponse } from '@fru-io/fru-apis/live/administration/v1alpha1/auth_pb'
import { File, RestoreFilesRequest, RestoreFilesResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

import * as grpc from '@grpc/grpc-js'
import * as depGrpc from 'grpc'
import { refreshToken } from '../../auth/cli';

const creds = grpc.ChannelCredentials.createInsecure()
const client = new SitesClient('localhost:8080', creds as grpc.ChannelCredentials )

const restore = new program.Command('restore <site>')
  .command('restore <site>')
  .description('restore files from a staging area')
  .action( async (site: string) => {

    const token = await refreshToken()
    const meta = {
      'X-Auth-Token': token
    }

    console.log({
      site,
      meta,
    })
    const req = new RestoreFilesRequest()
    req.setSite(site)
    const promiseResonse = new Promise<void>( (resolve) => {
      client.restoreFiles(req, meta, (error: depGrpc.ServiceError | null, response?: RestoreFilesResponse) => {
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