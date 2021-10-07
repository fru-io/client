#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var cmd_1 = __importDefault(require("./files/cmd"));
var cmd_2 = __importDefault(require("./database/cmd"));
var cli_1 = __importDefault(require("./auth/cli"));
var cmd_3 = __importDefault(require("./whoami/cmd"));
var cmd_4 = __importDefault(require("./clone/cmd"));
commander_1.program.enablePositionalOptions();
commander_1.program.addCommand(cli_1.default);
commander_1.program.addCommand(cmd_2.default);
commander_1.program.addCommand(cmd_1.default);
commander_1.program.addCommand(cmd_3.default);
commander_1.program.addCommand(cmd_4.default);
commander_1.program.parse(process.argv);
