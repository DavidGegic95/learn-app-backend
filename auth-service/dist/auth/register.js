"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const utils_1 = require("./utils/utils");
const uuid_1 = require("uuid");
const registerRepo_1 = require("./repository/registerRepo");
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const register = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = (0, utils_1.parseBody)(event);
        if (!requestBody) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Required request body, or corresponding paramaters missing",
                }),
            };
        }
        const existingUser = yield (0, registerRepo_1.checkEmail)(requestBody.email);
        if (!existingUser) {
            return {
                statusCode: 409,
                body: JSON.stringify({
                    message: `User with email ${requestBody.email} already exist.`,
                }),
            };
        }
        const userName = (0, utils_1.generateUserName)(requestBody.firstName, requestBody.lastName);
        const password = (0, utils_1.generatePass)();
        const userId = (0, uuid_1.v4)();
        //
        const user = yield (0, registerRepo_1.registerUser)(userId, userName, password, requestBody);
        if (!user) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Failed to add user" }),
            };
        }
        //
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "User added successfully",
                username: userName,
                password: password,
            }),
        };
    }
    catch (error) {
        console.error("Error logging in:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
});
exports.register = register;
