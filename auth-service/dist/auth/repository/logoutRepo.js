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
exports.logoutUserRepo = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const logoutUserRepo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: "User",
        Key: {
            id: id,
        },
        UpdateExpression: "SET #isActive = :isActive",
        ConditionExpression: "attribute_exists(id)",
        ExpressionAttributeNames: {
            "#isActive": "isActive",
        },
        ExpressionAttributeValues: {
            ":isActive": false,
        },
        ReturnValues: "ALL_NEW",
    };
    try {
        return yield dynamoDb.update(params).promise();
    }
    catch (error) {
        if (error.code === "ConditionalCheckFailedException") {
            return null;
        }
        throw error;
    }
});
exports.logoutUserRepo = logoutUserRepo;
