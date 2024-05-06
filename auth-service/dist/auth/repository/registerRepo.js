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
exports.checkEmail = exports.registerUser = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const putTrainer = (userId, specId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainerParams = {
            TableName: "Trainer",
            Item: {
                id: (0, uuid_1.v4)(),
                userId: userId,
                specializationId: specId,
            },
        };
        yield dynamoDb.put(trainerParams).promise();
    }
    catch (err) {
        throw err;
    }
});
const registerUser = (userId, userName, password, requestBody) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: "User",
        Item: {
            id: userId,
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            email: requestBody.email,
            role: requestBody.role,
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
    const specializationParams = {
        TableName: "Specialization",
        FilterExpression: "specialization = :specialization",
        ExpressionAttributeValues: {
            ":specialization": requestBody.specialization,
        },
    };
    try {
        let specId = "";
        const user = yield dynamoDb.put(params).promise();
        if (requestBody.role === "student") {
            yield dynamoDb.put(studentParams).promise();
        }
        else {
            const spec = yield dynamoDb.scan(specializationParams).promise();
            if (spec.Items && spec.Items[0]) {
                specId = yield spec.Items[0].id;
            }
            else {
                specId = (0, uuid_1.v4)();
                const createSpecializationParams = {
                    TableName: "Specialization",
                    Item: {
                        id: specId,
                        specialization: requestBody.specialization,
                    },
                };
                yield dynamoDb.put(createSpecializationParams).promise();
            }
            yield putTrainer(userId, specId);
        }
        return user;
    }
    catch (error) {
        return null;
    }
});
exports.registerUser = registerUser;
const checkEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const emailParams = {
        TableName: "User",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": email,
        },
    };
    try {
        const user = yield dynamoDb.scan(emailParams).promise();
        console.log("useer", user);
        if (user.Items && user.Items[0]) {
            return null;
        }
        else {
            return user;
        }
    }
    catch (err) {
        console.log(err);
        return null;
    }
});
exports.checkEmail = checkEmail;
