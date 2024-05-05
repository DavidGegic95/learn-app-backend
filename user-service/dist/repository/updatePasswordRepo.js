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
exports.updatePasswordRepo = exports.getUserRepo = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const getUserRepo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUserParams = {
            TableName: "User",
            Key: {
                id: id,
            },
        };
        const user = yield dynamoDb.get(getUserParams).promise();
        return user.Item;
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
exports.getUserRepo = getUserRepo;
const updatePasswordRepo = (id, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateParams = {
            TableName: "User",
            Key: {
                id: id,
            },
            UpdateExpression: "SET #password = :password",
            ConditionExpression: "attribute_exists(id)",
            ExpressionAttributeNames: {
                "#password": "password",
            },
            ExpressionAttributeValues: {
                ":password": newPassword,
            },
            ReturnValues: "ALL_NEW",
        };
        const updatedUser = yield dynamoDb.update(updateParams).promise();
        return updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.Attributes;
    }
    catch (err) {
        console.log(err);
        return null;
    }
});
exports.updatePasswordRepo = updatePasswordRepo;
