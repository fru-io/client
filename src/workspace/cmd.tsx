#!/usr/bin/env node
import * as program from 'commander';
import developer from './developer/cmd'
import admin from './admin/cmd'
import list from './list/cmd'
import select from './select/cmd'

const workspace = new program.Command('workspace')
  .command('workspace')
  .description('workspace operations')

workspace.addCommand(developer)
workspace.addCommand(admin)
workspace.addCommand(list)
workspace.addCommand(select)

export default workspace