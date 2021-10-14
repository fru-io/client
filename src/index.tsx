#!/usr/bin/env node
import { program } from 'commander';

import files from './files/cmd';
import database from './database/cmd';
import auth from './auth/cli'
import whoami from './whoami/cmd';
import clone from './clone/cmd';
import site from './site/cmd';
import workspace from './workspace/cmd';

program.enablePositionalOptions()

program.addCommand(auth)
program.addCommand(database)
program.addCommand(files)
program.addCommand(whoami)
program.addCommand(clone)
program.addCommand(site)
program.addCommand(workspace)

program.parse(process.argv)