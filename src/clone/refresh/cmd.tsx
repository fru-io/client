#!/usr/bin/env node
import * as program from 'commander';

const backup = new program.Command('backup <site>')
  .command('backup <site>')
  .description('backup files into a staging area')
  .action( async (site: string) => {
    console.log({
      site,
    })
  })

export default backup