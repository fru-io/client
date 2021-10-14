#!/usr/bin/env node
import * as program from 'commander';
import list from './list/cmd'
import create from './create/cmd'

const backup = new program.Command('backup')
  .command('backup')
  .description('backup operations')

backup.addCommand(list)
backup.addCommand(create)

export default backup