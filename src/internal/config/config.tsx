//

import { AdministrationClient } from '@fru-io/fru-apis/live/administration/v1alpha1/service_grpc_pb'
import { SitesClient } from '@fru-io/fru-apis/live/sites/v1alpha1/service_grpc_pb'
import * as grpc from '@grpc/grpc-js'

interface Config {
    host:string
    creds:grpc.ChannelCredentials
    sitesClient?:SitesClient
    adminClient?:AdministrationClient
}

const config:Config = {
    host: "api.fru.io:443",
    creds: grpc.ChannelCredentials.createSsl(),
}

if (process.env.API_HOST) {
    config.host = process.env.API_HOST
}

if (process.env.INSECURE) {
    config.creds = grpc.ChannelCredentials.createInsecure()
}

export const GetConfig = (): Config => config

// A singleton helper to retrieve a SitesClient with the config
export const GetSitesClient = (): SitesClient => {
    if ( !config.sitesClient ) {
        config.sitesClient = new SitesClient(config.host, config.creds)
    }
    return config.sitesClient
}

// A singleton helper to retrieve a AdminClient with the config
export const GetAdminClient = (): AdministrationClient => {
    if ( !config.adminClient ) {
        config.adminClient = new AdministrationClient(config.host, config.creds)
    }
    return config.adminClient
}

export default Config