#!/usr/bin/env node
import * as program from 'commander';

const describe = new program.Command('describe <site>')
  .command('describe <site>')
  .description('describe a site')
  .action( async (site: string) => {
    console.log({
      site,
    })
  })

export default describe