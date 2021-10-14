#!/usr/bin/env node
import * as program from 'commander';
// import App from './ui';
import * as grpc from '@grpc/grpc-js'

import { refreshToken } from '../../auth/cli';
import { ListSiteRequest, ListSiteResponse, Site, SiteType } from '@fru-io/fru-apis/live/sites/v1alpha1/site_pb';
import { GetSitesClient } from '../../internal/config/config';

const client = GetSitesClient()

const list = new program.Command('list')
  .command('list')
  .description('list sites')
  .action( async () => {

    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)

    const reqPromise = new Promise<void>( (resolve, reject) => {
      const req = new ListSiteRequest()
      client.listSites(new ListSiteRequest(), meta, (error: grpc.ServiceError | null, response?: ListSiteResponse) => {
        if (error) {
          reject(error)
        }
        response.getSitesList().forEach( (site: Site) => {
          let type = "unknown"
          if (site.getType() == SiteType.DRUPAL) {
            type = "Drupal"
          } else if ( site.getType() == SiteType.WORDPRESS) {
            type = "Wordpress"
          }
          console.log({
            workspace: site.getWorkspace(),
            name: site.getName(),
            type: type,
            database_ready: site.getStatus().getDatabase(),
            filestore_ready: site.getStatus().getFilestore(),
            server_ready: site.getStatus().getServer(),
          })
          resolve()
        })
      })
    })
    try {
      await reqPromise
    } catch ( e ) {
      console.log({e})
    }
  })

export default list