#!/usr/bin/env node
import * as program from 'commander';

import * as grpc from '@grpc/grpc-js'
import { refreshToken } from '../../../auth/cli';

import React from 'react';
import {render} from 'ink';
import {DefaultComponent, JSONComponent} from './ui'
import { ListDatabaseBackupsRequest } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';

const format = new program.Option("--json", "format output to json")
const site = new program.Option("--site", "an optional filter on site, the source of the backup")
const list = new program.Command('list')
  .command('list')
  .description('initiate a backup of a sites current database')
  .addOption(format)
  .addOption(site)
  .action( async (args: any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const backupReq = new ListDatabaseBackupsRequest()
    if ( args.site ) {
      backupReq.setSite(args.site)
    }

    if ( args.json ) {
      render(
        <JSONComponent req={backupReq} meta={meta}></JSONComponent>
      )
    } else {
      render(
        <DefaultComponent req={backupReq} meta={meta}></DefaultComponent>
      )
    }
  })


export default list