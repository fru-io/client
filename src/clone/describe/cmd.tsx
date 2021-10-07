#!/usr/bin/env node
import * as program from 'commander';

const describe = new program.Command('describe <clone>')
  .command('describe <clone>')
  .description('describe a clone')
  .action( async (clone: string) => {
    console.log({
      clone,
    })
  })

export default describe