#!/usr/bin/env node
import * as program from 'commander';
import * as grpc from '@grpc/grpc-js'
import React from 'react';
import {render} from 'ink';

import { refreshToken } from '../../auth/cli';
import { DescribeFileBackupRequest, DescribeFileBackupResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

import {DefaultComponent, JSONComponent} from './ui'

const format = new program.Option("--json", "format output to json")
const describe = new program.Command('describe <site>')
  .command('describe <site>')
  .addOption(format)
  .description('describe files staged for site')
  .action( async (site: string, args: any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const describefiles = new DescribeFileBackupRequest()
    describefiles.setSite(site)

    if ( args.json ) {
      render(
        <JSONComponent req={describefiles} meta={meta}></JSONComponent>
      )
    } else {
      render(
        <DefaultComponent req={describefiles} meta={meta}></DefaultComponent>
      )
    }
  })

export default describe