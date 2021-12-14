#!/usr/bin/env node
import * as program from 'commander';

import * as grpc from '@grpc/grpc-js'
import { refreshToken } from '../../../auth/cli';

import React from 'react';
import {render} from 'ink';
import {DefaultComponent, JSONComponent} from './ui'
import { ListFileBackupsRequest } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

const format = new program.Option("--json", "format output to json")
const site = new program.Option("--site", "an optional filter on site, the source of the backup")
const list = new program.Command('list')
  .command('list')
  .description('list existing file backups')
  .addOption(format)
  .addOption(site)
  .action( async (args: any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const req = new ListFileBackupsRequest()
    if ( args.site ) {
      req.setSite(args.site)
    }

    if ( args.json ) {
      render(
        <JSONComponent req={req} meta={meta}></JSONComponent>
      )
    } else {
      render(
        <DefaultComponent req={req} meta={meta}></DefaultComponent>
      )
    }
  })


export default list