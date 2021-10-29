#!/usr/bin/env node
import * as program from 'commander';
// import App from './ui';
import * as grpc from '@grpc/grpc-js'

import { refreshToken } from '../../auth/cli';
import { ListSiteRequest, ListSiteResponse, Site, SiteType } from '@fru-io/fru-apis/live/sites/v1alpha1/site_pb';
import { GetSitesClient } from '../../internal/config/config';
import React from 'react';
import {render} from 'ink';
import {DefaultComponent, JSONComponent} from './ui'

const client = GetSitesClient()

const format = new program.Option("--json", "format output to json")
const list = new program.Command('list')
  .command('list')
  .addOption(format)
  .description('list sites')
  .action( async (args: any) => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const listSiteRequest = new ListSiteRequest()

    if ( args.json ) {
      render(
        <JSONComponent req={listSiteRequest} meta={meta}></JSONComponent>
      )
    } else {
      render(
        <DefaultComponent req={listSiteRequest} meta={meta}></DefaultComponent>
      )
    }
  })

export default list