#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var program = __importStar(require("commander"));
var cmd_1 = __importDefault(require("./push/cmd"));
var cmd_2 = __importDefault(require("./pull/cmd"));
var cmd_3 = __importDefault(require("./describe/cmd"));
var cmd_4 = __importDefault(require("./backup/cmd"));
var cmd_5 = __importDefault(require("./restore/cmd"));
var files = new program.Command('files')
    .command('files')
    .description('file operations with sites');
files.addCommand(cmd_1.default);
files.addCommand(cmd_2.default);
// VAPOR BELOW
files.addCommand(cmd_3.default);
files.addCommand(cmd_4.default);
files.addCommand(cmd_5.default);
exports.default = files;
