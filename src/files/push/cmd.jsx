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
var react_1 = __importDefault(require("react"));
var ink_1 = require("ink");
var program = __importStar(require("commander"));
var ui_1 = require("./ui");
var service_grpc_pb_1 = require("@fru-io/fru-apis/live/sites/v1alpha1/service_grpc_pb");
var grpc = __importStar(require("@grpc/grpc-js"));
// import { CreateTokenRequest, CreateTokenResponse } from '@fru-io/fru-apis/live/administration/v1alpha1/auth_pb'
var file_pb_1 = require("@fru-io/fru-apis/live/sites/v1alpha1/file_pb");
var creds = grpc.ChannelCredentials.createInsecure();
var client = new service_grpc_pb_1.SitesClient('localhost:8080', creds);
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cli_1 = require("../../auth/cli");
var writeFile = function (stream, req) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                stream.write(req, function () {
                    // TODO: Replace with render call
                    var f = req.getFile();
                    if (f) {
                        ink_1.render(<ui_1.FileC name={f.getPath()}/>);
                    }
                    resolve(req);
                });
            })];
    });
}); };
var writeFiles = function (stream, origin, files, site, dest) {
    var promises = [];
    files.forEach(function (file) {
        file = path_1.default.resolve(origin, file);
        var relativePath = path_1.default.relative(origin, file);
        var f = new file_pb_1.File();
        f.setPath(relativePath);
        var buf = fs_1.default.readFileSync(file);
        f.setContent(buf.valueOf());
        var req = new file_pb_1.PushFileBackupRequest();
        req.setFile(f);
        req.setSite(site);
        if (dest != "" && dest != "/") {
            req.setDirectory(dest);
        }
        promises = promises.concat(writeFile(stream, req));
    });
    return Promise.all(promises);
};
var getFiles = function (file, origin) {
    var fileList = [];
    if (origin) {
        file = path_1.default.resolve(origin, file);
    }
    var stat = fs_1.default.statSync(file);
    if (stat && stat.isDirectory()) {
        var list = fs_1.default.readdirSync(file);
        list.forEach(function (dirFile) {
            fileList = fileList.concat(getFiles(dirFile, file));
        });
    }
    else {
        fileList = fileList.concat(file);
    }
    return fileList;
};
var push = new program.Command('push <site> <path> <dest>')
    .command('push <site> <path> <dest>')
    .description('upload one or more files')
    .action(function (site, path, dest) { return __awaiter(void 0, void 0, void 0, function () {
    var token, meta, backupName, stream, files, promises, req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cli_1.refreshToken()];
            case 1:
                token = _a.sent();
                meta = new grpc.Metadata;
                meta.add('X-Auth-Token', token);
                backupName = "";
                stream = client.pushFileBackupStream(meta, function (error, response) {
                    console.log({
                        response: response,
                        error: error,
                    });
                    backupName = response === null || response === void 0 ? void 0 : response.getName();
                }).on("error", function (err) {
                    console.log({
                        err: err,
                    });
                });
                files = getFiles(path);
                promises = writeFiles(stream, path, files, site, dest);
                return [4 /*yield*/, promises];
            case 2:
                _a.sent();
                stream.end();
                if (backupName) {
                    req = new file_pb_1.RestoreFilesRequest();
                    req.setSite(site);
                    client.restoreFiles(req, meta, function (error, response) {
                        if (error) {
                            console.log(error.message);
                            process.exit(1);
                        }
                        console.log("created file backup restore operation: " + (response === null || response === void 0 ? void 0 : response.getName()));
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
exports.default = push;
