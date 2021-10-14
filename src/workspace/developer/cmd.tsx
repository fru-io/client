#!/usr/bin/env node
import * as program from 'commander';
import add from './add/cmd'
import remove from './delete/cmd'

const developer = new program.Command('developer')
  .command('developer')
  .description('developer operations')

developer.addCommand(add)
developer.addCommand(remove)


export default developer