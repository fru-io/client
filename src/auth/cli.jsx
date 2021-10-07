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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.refreshToken = void 0;
// import React from 'react';
// import {render} from 'ink';
var program = __importStar(require("commander"));
// import App from './ui';
var service_grpc_pb_1 = require("@fru-io/fru-apis/live/administration/v1alpha1/service_grpc_pb");
var grpc = __importStar(require("@grpc/grpc-js"));
var auth_pb_1 = require("@fru-io/fru-apis/live/administration/v1alpha1/auth_pb");
var os_1 = __importDefault(require("os"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var getconfig = function () {
    var home = os_1.default.homedir();
    var configDir = path_1.default.join(home, '.config', 'fruition');
    if (!fs_1.default.existsSync(configDir)) {
        fs_1.default.mkdirSync(configDir);
    }
    var tokenFile = path_1.default.join(configDir, '.token');
    return tokenFile;
};
var storeConfig = function (c) {
    var config = getconfig();
    console.log("wrote " + config);
    fs_1.default.writeFileSync(config, JSON.stringify(c));
};
var creds = grpc.ChannelCredentials.createInsecure();
var client = new service_grpc_pb_1.AdministrationClient('localhost:8080', creds);
var promiseToken = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                    client.createToken(req, function (error, response) {
                        if (error) {
                            reject(error);
                        }
                        if (response) {
                            return resolve(response);
                        }
                    });
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var initAuth = function (refresh) { return __awaiter(void 0, void 0, void 0, function () {
    var req, resp_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new auth_pb_1.CreateTokenRequest();
                req.setApitoken(refresh);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, promiseToken(req)];
            case 2:
                resp_1 = _a.sent();
                storeConfig({
                    token: resp_1.getToken(),
                    refresh: refresh,
                });
                return [2 /*return*/, new Promise(function (resolve) {
                        return resolve(resp_1.getToken());
                    })];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, new Promise(function (reject) {
                        return reject(err_1);
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
var refreshToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, buf, parsed, token_1, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = getconfig();
                buf = fs_1.default.readFileSync(config);
                parsed = JSON.parse(buf.toString());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, initAuth(parsed.refresh)];
            case 2:
                token_1 = _a.sent();
                return [2 /*return*/, new Promise(function (resolve) {
                        return resolve(token_1);
                    })];
            case 3:
                err_2 = _a.sent();
                return [2 /*return*/, new Promise(function (reject) {
                        return reject(err_2);
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = refreshToken;
var getToken = function () {
    var config = getconfig();
    var buf = fs_1.default.readFileSync(config);
    var parsed = JSON.parse(buf.toString());
    return parsed.token;
};
exports.getToken = getToken;
var auth = new program.Command('auth')
    .command('auth')
    .description('authenticate to fru')
    .action(function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var refresh, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refresh = args.token;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, initAuth(refresh)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
auth.requiredOption('-t, --token <API_TOKEN>', 'a fru API token', '');
exports.default = auth;
