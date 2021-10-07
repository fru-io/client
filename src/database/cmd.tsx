#!/usr/bin/env node
import * as program from 'commander';
import push from './push/cmd'
import pull from './pull/cmd'
import backup from './backup/cmd'
import restore from './restore/cmd'

const database = new program.Command('database')
    .command('database')
    .description('database operations for sites')
database.addCommand(push)
database.addCommand(pull)
database.addCommand(backup)
database.addCommand(restore)

export default database