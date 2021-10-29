#!/usr/bin/env node
import * as program from 'commander';
import create from './create/cmd'
import del from './delete/cmd'
import list from './list/cmd'
import describe from './describe/cmd'
import exec from './exec/cmd'

const site = new program.Command('site')
    .command('site')
    .description('site operations')
site.addCommand(create)
site.addCommand(del)
site.addCommand(list)
site.addCommand(describe)
site.addCommand(exec)

export default site