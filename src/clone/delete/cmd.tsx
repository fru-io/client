#!/usr/bin/env node
import * as program from 'commander';

const del = new program.Command('delete <clone>')
  .command('delete <clone>')
  .description('delete a cloned site')
  .action( async (clone: string) => {
    console.log({
      clone,
    })
  })

export default del