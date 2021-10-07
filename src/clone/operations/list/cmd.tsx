#!/usr/bin/env node
import * as program from 'commander';

const list = new program.Command('list')
  .command('list')
  .description('list clone operations')
  .action( async () => {
  })

export default list