#!/usr/bin/env node

import * as program from 'commander';
import create from './create/cmd'
import list from './list/cmd'

const backup = new program.Command('backup')
  .command('backup')
  .description('backup operations with files')
  backup.addCommand(create)
  backup.addCommand(list)
  // VAPOR BELOW

export default backup