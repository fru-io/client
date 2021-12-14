#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import * as program from 'commander';
import { FileC } from './ui';
import * as grpc from '@grpc/grpc-js'
import fs from 'fs'
import path from 'path'
import { File, PushFileBackupRequest, PushFileBackupResponse, RestoreFilesRequest, RestoreFilesResponse } from '@fru-io/fru-apis/live/sites/v1alpha1/file_pb';

import { refreshToken } from '../../auth/cli';
import { GetSitesClient } from '../../internal/config/config';

const client = GetSitesClient()

const writeFile = async (stream : grpc.ClientWritableStream<PushFileBackupRequest>, req: PushFileBackupRequest): Promise<PushFileBackupRequest> => {
  return new Promise( (resolve) => {
    stream.write(req, () => {
      // TODO: Replace with render call
      const f = req.getFile()
      if ( f ) {
        render(
          <FileC name={f.getPath()} />
        );
      }
      resolve(req)
    })
  })
}

const writeFiles = (stream: grpc.ClientWritableStream<PushFileBackupRequest>, origin: string, files: string[], site: string, dest: string): Promise<PushFileBackupRequest[]> => {
  let promises: Promise<PushFileBackupRequest>[] = []

  files.forEach( (file: string) => {
    file = path.resolve(origin, file)
    const relativePath = path.relative(origin, file)
    const f = new File()
    f.setPath(relativePath)
    const buf = fs.readFileSync(file)
    f.setContent(buf.valueOf())

    const req = new PushFileBackupRequest()
    req.setFile(f)
    req.setSite(site)
    if ( dest != "" && dest != "/" ) {
      req.setDirectory(dest)
    }
    promises = promises.concat(writeFile(stream, req))
  })

  return Promise.all(promises)
}

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

const push = new program.Command('push <site> <path> <dest>')
  .command('push <site> <path> <dest>')
  .description('upload one or more files')
  .action( async (site: string, path: string, dest: string) => {

    // Manually refresh the token
    const token = await refreshToken()
    const meta = new grpc.Metadata
    meta.add('X-Auth-Token', token)
    let backupName: string | undefined = "" 
    const stream : grpc.ClientWritableStream<PushFileBackupRequest> = client.pushFileBackupStream(meta, (error: grpc.ServiceError | null, response?: PushFileBackupResponse) => {
      console.log({
        response,
        error,
      })
      backupName = response?.getName()
    }).on("error", (err: Error) => {
      console.log({
        err,
      })
    })
    
    const files = getFiles(path)
    const promises = writeFiles(stream, path, files, site, dest)
    await promises
    stream.end()

    if (backupName) {
      // Restore the files
      const req = new RestoreFilesRequest()
      req.setName(site)
      client.restoreFiles(req, meta, (error: grpc.ServiceError | null, response?: RestoreFilesResponse) => {
        if ( error ) {
          console.log(error.message)
          process.exit(1)
        }
        console.log("created file backup restore operation: " + response?.getName())
      })
    }
    
  })

export default push