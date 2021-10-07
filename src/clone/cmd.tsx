#!/usr/bin/env node
import * as program from 'commander';
import create from './create/cmd'
import del from './delete/cmd'
import list from './list/cmd'
import describe from './describe/cmd'
import operation from './operations/cmd'
import refresh from './refresh/cmd'

const clone = new program.Command('clone')
    .command('clone')
    .description('site clone operations')
clone.addCommand(create)
clone.addCommand(del)
clone.addCommand(list)
clone.addCommand(describe)
clone.addCommand(operation)
clone.addCommand(refresh)

export default clone