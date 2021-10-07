#!/usr/bin/env node
import * as program from 'commander';

const create = new program.Command('create <site>')
  .command('create <site>')
  .description('create a clone of a site')
  .action( async (site: string) => {
    console.log({
      site,
    })
  })

export default create