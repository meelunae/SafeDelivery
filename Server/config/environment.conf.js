"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = exports.checkRequiredEnvVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function checkRequiredEnvVariables(requiredVariables) {
    const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);
    if (missingVariables.length > 0) {
        throw new Error(`Some required environment variables are missing: ${missingVariables.join(', ')}`);
    }
}
exports.checkRequiredEnvVariables = checkRequiredEnvVariables;
const getEnvVar = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Tried to get environment variable ${key} but it was not found.`);
    }
    return value;
};
exports.getEnvVar = getEnvVar;
