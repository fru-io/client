#!/usr/bin/env node
import * as program from 'commander';

const del = new program.Command('delete <site>')
  .command('delete <site>')
  .description('delete a site')
  .action( async (site: string) => {
    console.log({
      site,
    })
  })

export default del