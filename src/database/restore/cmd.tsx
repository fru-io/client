#!/usr/bin/env node
import * as program from 'commander';

const restore = new program.Command('restore <site>')
  .command('restore <site>')
  .description('restore files from staging')
  .action( async (site: string) => {
    console.log({
      site,
    })
  })

export default restore