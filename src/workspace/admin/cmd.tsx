#!/usr/bin/env node
import * as program from 'commander';
import add from './add/cmd'
import remove from './delete/cmd'

const admin = new program.Command('admin')
  .command('admin')
  .description('admin operations')

admin.addCommand(add)
admin.addCommand(remove)


export default admin