#!/usr/bin/env node
// import React from 'react';
// import {render} from 'ink';
import * as program from 'commander';
import * as grpc from '@grpc/grpc-js'
import { DatabaseBackupMetadataRequest, PullDatabaseBackupRequest } from '@fru-io/fru-apis/live/sites/v1alpha1/database_pb';
import { refreshToken } from '../../auth/cli';
import React from 'react';
import {render} from 'ink';

import { GetSitesClient } from '../../internal/config/config';
import { DefaultComponent } from './ui';

const client = GetSitesClient()

const pull = new program.Command('pull <name> <path>')
  .command('pull <name> <path>')
  .description('retrieve a database from a backup')
  .action( async (name: string, args:any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)
    
    // Get the metadata for the total size
    const metaReq = new DatabaseBackupMetadataRequest()
    metaReq.setBackup(name)

    const req = new PullDatabaseBackupRequest()
    req.setBackup(name)


    // TODO: Support json, has to block until complete
    // if ( args.json ) {
    //   render(
    //     <JSONComponent req={req} meta={meta}></JSONComponent>
    //   )
    // } else {
    render(
      <DefaultComponent req={req} metaReq={metaReq} meta={meta}></DefaultComponent>
    )
    // }
  })

export default pull