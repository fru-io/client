#!/usr/bin/env node
import * as program from 'commander';
import push from './push/cmd'
import pull from './pull/cmd'
import describe from './describe/cmd'
import backup from './backup/cmd'
import restore from './restore/cmd'

const files = new program.Command('files')
  .command('files')
  .description('file operations with sites')
files.addCommand(push)
files.addCommand(pull)
// VAPOR BELOW
files.addCommand(describe)
files.addCommand(backup)
files.addCommand(restore)

export default files