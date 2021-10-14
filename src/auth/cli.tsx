#!/usr/bin/env node
// import React from 'react';
// import {render} from 'ink';
import * as program from 'commander';
// import App from './ui';
import { AdministrationClient } from '@fru-io/fru-apis/live/administration/v1alpha1/service_grpc_pb'
// import { AdministrationClient } from '@fru-io/fru-apis/live/administration/v1alpha1/service_grpc_web_pb'

import * as grpc from '@grpc/grpc-js'

import { CreateTokenRequest, CreateTokenResponse } from '@fru-io/fru-apis/live/administration/v1alpha1/auth_pb'

import os from 'os'
import fs from 'fs'
import path from 'path'
import { GetAdminClient } from '../internal/config/config';

const client = GetAdminClient()

const getconfig = (): string => {

    const home = os.homedir()

    const configDir = path.join(home, '.config', 'fruition')
    if (!fs.existsSync(configDir)){
        fs.mkdirSync(configDir);
    }
    const tokenFile = path.join(configDir, '.token')
    return tokenFile
}

interface authConfig {
    token: string,
    refresh: string,
}

const storeConfig = (c: authConfig) => {
    const config = getconfig()
    // console.log("wrote " + config)
    fs.writeFileSync(config, JSON.stringify(c))
}

const promiseToken = async (req: CreateTokenRequest): Promise<CreateTokenResponse> => {
    return new Promise<CreateTokenResponse>((resolve, reject)  => {
        client.createToken(req, (error: grpc.ServiceError | null, response?: CreateTokenResponse): void => {
            if (error) {
                // FIXME: Render
                console.log({
                   error,
                })
                reject(error)
            }
            if ( response ) {
                resolve(response)
            }
        })
    })
}

const initAuth = async (refresh: string): Promise<string> =>{

    const req = new CreateTokenRequest()
    req.setApitoken(refresh)
    try {
        const resp = await promiseToken(req)
        storeConfig({
            token: resp.getToken(),
            refresh: refresh,
        })
        return new Promise<string>((resolve) => {
            return resolve(resp.getToken())
        })
    } catch ( err ) {
        return new Promise<string>((reject) => {
            return reject(err)
        })
    }
}

export const refreshToken = async (): Promise<string> => {
    const config = getconfig()
    const buf = fs.readFileSync(config)
    const parsed:authConfig =  JSON.parse(buf.toString()) as authConfig
    try {
        const token = await initAuth(parsed.refresh)
        return new Promise<string>((resolve) => {
            return resolve(token)
        })
    } catch ( err ) {
        return new Promise<string>((reject) => {
            return reject(err)
        })
    }
}

export const getToken = (): string => {
    const config = getconfig()
    const buf = fs.readFileSync(config)
    const parsed:authConfig = JSON.parse(buf.toString()) as authConfig
    return parsed.token
}

const auth = new program.Command('auth')
.command('auth')
.description('authenticate to fru')
.action( async (args: any) => {
    // Validate this token
    const refresh = args.token
    try{
        await initAuth(refresh)
    } catch ( err ) {
        console.log(err)
        process.exit(1)
    }
})

auth.requiredOption('-t, --token <API_TOKEN>', 'a fru API token', '')

export default auth

