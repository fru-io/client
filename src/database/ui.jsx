"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseC = exports.FileC = void 0;
var react_1 = __importDefault(require("react"));
var ink_1 = require("ink");
var FileC = function (_a) {
    var _b = _a.name, name = _b === void 0 ? '' : _b;
    return (<ink_1.Text>
		Successfully uploaded: <ink_1.Text color="green">{name}</ink_1.Text>
	</ink_1.Text>);
};
exports.FileC = FileC;
var DatabaseC = function (_a) {
    var _b = _a.name, name = _b === void 0 ? '' : _b;
    return (<ink_1.Text>
		Successfully uploaded: <ink_1.Text color="green">{name}</ink_1.Text>
	</ink_1.Text>);
};
exports.DatabaseC = DatabaseC;
