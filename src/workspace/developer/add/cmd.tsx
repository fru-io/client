#!/usr/bin/env node
import * as program from 'commander';

import * as grpc from '@grpc/grpc-js'
import { refreshToken } from '../../../auth/cli';
import { AddWorkspaceDeveloperRequest, AddWorkspaceDeveloperResponse } from '@fru-io/fru-apis/live/administration/v1alpha1/workspace_pb';
import { GetAdminClient } from '../../../internal/config/config';

const client = GetAdminClient()

const add = new program.Command('add <email>')
  .command('add <email>')
  .description('add a workspace developer')
  .action( async (email:string) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const req = new AddWorkspaceDeveloperRequest()
    req.setEmail(email)

    const respPromise = new Promise<void>( (resolve, reject) => {
      client.addWorkspaceDeveloper(req, meta, (error: grpc.ServiceError | null, value?: AddWorkspaceDeveloperResponse) => {
        if (error) {
          console.log({
            error,
          })
          reject(error)
        }
        resolve()
      })
    })
    await respPromise
  })



export default add