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
exports.getTrainingsBySpecialization = exports.getTrainingsByName = exports.getTrainingsByDate = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const getTrainingsByDate = (date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            TableName: "Training",
            FilterExpression: "#date = :date",
            ExpressionAttributeNames: {
                "#date": "date",
            },
            ExpressionAttributeValues: {
                ":date": date,
            },
        };
        const result = yield dynamoDb.scan(params).promise();
        return result.Items;
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
exports.getTrainingsByDate = getTrainingsByDate;
const getTrainingsByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            TableName: "Training",
            FilterExpression: "#name = :name",
            ExpressionAttributeNames: {
                "#name": "name",
            },
            ExpressionAttributeValues: {
                ":name": name,
            },
        };
        const result = yield dynamoDb.scan(params).promise();
        return result.Items;
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
exports.getTrainingsByName = getTrainingsByName;
const getTrainingsBySpecialization = (specialization) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = {
            TableName: "Training",
            FilterExpression: "#specialization = :specialization",
            ExpressionAttributeNames: {
                "#specialization": "specialization",
            },
            ExpressionAttributeValues: {
                ":specialization": specialization,
            },
        };
        const result = yield dynamoDb.scan(params).promise();
        return result.Items;
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
exports.getTrainingsBySpecialization = getTrainingsBySpecialization;
