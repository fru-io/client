#!/usr/bin/env node
import * as program from 'commander';

import * as grpc from '@grpc/grpc-js'
import { refreshToken } from '../../../auth/cli';

import React from 'react';
import {render} from 'ink';
import {DefaultComponent, JSONComponent} from './ui'
import { BackupDatabaseRequest } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';

const format = new program.Option("--json", "format output to json")
const backup = new program.Command('create <site>')
  .command('create <site>')
  .description('initiate a backup of a sites current database')
  .addOption(format)
  .action( async (site:string, args: any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const backupReq = new BackupDatabaseRequest()
    backupReq.setSite(site)

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


export default backup