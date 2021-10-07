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
var cmd_1 = __importDefault(require("./create/cmd"));
var cmd_2 = __importDefault(require("./delete/cmd"));
var cmd_3 = __importDefault(require("./list/cmd"));
var cmd_4 = __importDefault(require("./describe/cmd"));
var cmd_5 = __importDefault(require("./operations/cmd"));
var cmd_6 = __importDefault(require("./refresh/cmd"));
var clone = new program.Command('clone')
    .command('clone')
    .description('site clone operations');
clone.addCommand(cmd_1.default);
clone.addCommand(cmd_2.default);
clone.addCommand(cmd_3.default);
clone.addCommand(cmd_4.default);
clone.addCommand(cmd_5.default);
clone.addCommand(cmd_6.default);
exports.default = clone;
