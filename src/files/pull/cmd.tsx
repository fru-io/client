#!/usr/bin/env node
import * as program from 'commander';
import { SitesClient } from '@fru-io/fru-apis/live/sites/v1alpha1/service_grpc_pb'
// import { CreateTokenRequest, CreateTokenResponse } from '@fru-io/fru-apis/live/administration/v1alpha1/auth_pb'
import { File, PullFileBackupRequest, PullFileBackupResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

import * as grpc from '@grpc/grpc-js'

const creds = grpc.ChannelCredentials.createInsecure()
const client = new SitesClient('localhost:8080', creds as grpc.ChannelCredentials )

import fs from 'fs'
import path from 'path'
import os from 'os'

import { v4 as uuidv4 } from 'uuid';

import { refreshToken } from '../../auth/cli';

const getFiles = (file: string, origin?: string): string[] => {

  let fileList: string[] = []

  if ( origin ) {
    file = path.resolve(origin, file)
  }
  const stat = fs.statSync(file)
  if (stat && stat.isDirectory()) {

    const list = fs.readdirSync(file)

    list.forEach( (dirFile: string) => {
      fileList = fileList.concat(getFiles(dirFile, file))
    })
  } else {
    fileList = fileList.concat(file)
  }
  
  return fileList
}

const pull = new program.Command('pull <site> <path> <dest>')
  .command('pull <site> <path> <dest>')
  .description('retrieve one or more files')
  .action( async (site: string, path: string, dest: string) => {

    // Manually refresh the token
    const token = await refreshToken()
    const meta = {
      'X-Auth-Token': token
    }

    const req = new PullFileBackupRequest()
    req.setSite(site)

    const stream = client.pullFileBackupStream(req, meta)
    const id = uuidv4()
    // A scratch area to write files to until the stream closes
    const writeDir = path.concat(os.tmpdir(), "fru-", id)
    console.log({
      scratch: writeDir,
    })

    let promises: Promise<File>[] = []
    stream.on('data', (response: PullFileBackupResponse) => {
      console.log({
        event: 'data',
      })
      promises = promises.concat(new Promise<File>( (resolve) => {
        const f = response.getFile()
        if (f) {
          const writePath = path.concat(writeDir, f.getPath())
  
          const fd = fs.openSync(writePath, 'wa')
          fs.appendFileSync(fd, f.getContent())
          resolve(f)
        }
      }))
    })
    const serverClose = new Promise<boolean>( (resolve) => {
      stream.on('close', async () => {
        console.log({
          event: 'close',
        })
        resolve(true)
      })
    })
    await serverClose
    await Promise.all(promises)
    fs.rename(writeDir, dest, (err) => {
      console.log({
        "failed write": err,
      })
    })
  })

export default pull