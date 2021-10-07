#!/usr/bin/env node
import * as program from 'commander';

const whoami = new program.Command('whoami')
  .command('whoami')
  .description('describe the authenticated user')
  .action( async () => {
  })

export default whoami