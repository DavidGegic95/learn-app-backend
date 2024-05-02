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
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const register = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = (0, utils_1.parseBody)(event);
        const userId = (0, uuid_1.v4)();
        if (!requestBody) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Required request body, or corresponding paramaters missing",
                }),
            };
        }
        const userName = (0, utils_1.generateUserName)(requestBody.firstName, requestBody.lastName);
        const password = (0, utils_1.generatePass)();
        const params = {
            TableName: "User",
            Item: {
                id: userId,
                firstName: requestBody.firstName,
                lastName: requestBody.lastName,
                email: requestBody.email,
                isActive: false,
                username: userName,
                photo: "",
                password: password,
            },
        };
        const studentParams = {
            TableName: "Student",
            Item: {
                id: (0, uuid_1.v4)(),
                userId: userId,
                dateOfBirth: requestBody.dateOfBirth || "",
                address: requestBody.address || "",
            },
        };
        const emailParams = {
            TableName: "Email",
            Item: {
                email: requestBody.email,
                id: userId,
            },
        };
        const specializationParams = {
            TableName: "Specialization",
            FilterExpression: "specialization = :specialization",
            ExpressionAttributeValues: {
                ":specialization": requestBody.specialization,
            },
        };
        try {
            const user = yield dynamoDb.put(params).promise();
            if (requestBody.role === "student") {
                yield Promise.all([
                    dynamoDb.put(studentParams).promise(),
                    dynamoDb.put(emailParams).promise(),
                ]);
            }
            else {
                const spec = yield dynamoDb.scan(specializationParams).promise();
                let specId = "";
                if (spec.Items) {
                    const specObj = spec.Items[0];
                    if (specObj) {
                        specId = specObj.id;
                    }
                    else {
                        specId = (0, uuid_1.v4)();
                        const specializationParams = {
                            TableName: "Specialization",
                            Item: {
                                id: specId,
                                specialization: requestBody.specialization,
                            },
                        };
                        yield dynamoDb.put(specializationParams).promise();
                    }
                }
                const trainerParams = {
                    TableName: "Trainer",
                    Item: {
                        id: (0, uuid_1.v4)(),
                        userId: userId,
                        specializationId: specId,
                    },
                };
                yield Promise.all([
                    dynamoDb.put(emailParams).promise(),
                    dynamoDb.put(trainerParams).promise(),
                ]);
            }
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
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Failed to add user" }),
            };
        }
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
