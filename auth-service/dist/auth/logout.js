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
exports.logout = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const logoutRepo_1 = require("./repository/logoutRepo");
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const logout = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "Email is required" }),
            };
        }
        const updatedUser = yield (0, logoutRepo_1.logoutUserRepo)(id);
        if (!updatedUser) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Bad request, user with id does not exist.",
                }),
            };
        }
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Logout successful",
            }),
        };
    }
    catch (error) {
        console.error("Error logging out:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
});
exports.logout = logout;
