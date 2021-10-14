#!/usr/bin/env node
import * as program from 'commander';

import * as grpc from '@grpc/grpc-js'
import { refreshToken } from '../../auth/cli';
import { ListWorkspaceRequest } from '@fru-io/fru-apis/live/administration/v1alpha1/workspace_pb';

import React from 'react';
import {render} from 'ink';
import {DefaultComponent, JSONComponent} from './ui'

const format = new program.Option("--json", "format output to json")
const list = new program.Command('list')
  .command('list')
  .addOption(format)
  .description('list workspaces')
  .action( async (args: any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const defaultWSReq = new ListWorkspaceRequest()

    if ( args.json ) {
      render(
        <JSONComponent req={defaultWSReq} meta={meta}></JSONComponent>
      )
    } else {
      render(
        <DefaultComponent req={defaultWSReq} meta={meta}></DefaultComponent>
      )
    }
  })

export default list