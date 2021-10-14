#!/usr/bin/env node
import * as program from 'commander';

import * as grpc from '@grpc/grpc-js'
import { refreshToken } from '../../../auth/cli';
import { AddWorkspaceAdminRequest, AddWorkspaceAdminResponse, GetDefaultWorkspaceRequest, GetDefaultWorkspaceResponse } from '@fru-io/fru-apis/live/administration/v1alpha1/workspace_pb';
import { GetAdminClient } from '../../../internal/config/config';

const client = GetAdminClient()

const add = new program.Command('add <email>')
  .command('add <email>')
  .description('add a workspace admin')
  .action( async (email:string) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const defaultWSReq = new GetDefaultWorkspaceRequest()
    const defaultWSPromise = new Promise<string>( (resolve, reject) => {
      client.getDefaultWorkspace(defaultWSReq, meta, (error: grpc.ServiceError | null, value?: GetDefaultWorkspaceResponse) => {
        if (error) {
          reject(error)
        }
        resolve(value.getWorkspace())
      })
    })
    const defaultWS = await defaultWSPromise

    const req = new AddWorkspaceAdminRequest()
    req.setEmail(email)
    req.setWorkspace(defaultWS)

    const respPromise = new Promise<void>( (resolve, reject) => {
      client.addWorkspaceAdmin(req, meta, (error: grpc.ServiceError | null, value?: AddWorkspaceAdminResponse) => {
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