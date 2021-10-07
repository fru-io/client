#!/usr/bin/env node
import * as program from 'commander';
import list from './list/cmd'

const operation = new program.Command('operation')
  .command('operation')
  .description('examine running operations for cloning')
operation.addCommand(list)

export default operation