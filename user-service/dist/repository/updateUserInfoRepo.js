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
exports.updateStudentInfoByUserId = exports.updateUserRepo = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const updateUserRepo = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateParams = {
            TableName: "User",
            Key: {
                id: body.id,
            },
            UpdateExpression: "SET #firstName = :firstName, #lastName = :lastName, #username = :username, #isActive = :isActive",
            ConditionExpression: "attribute_exists(id)",
            ExpressionAttributeNames: {
                "#firstName": "firstName",
                "#lastName": "lastName",
                "#username": "username",
                "#isActive": "isActive",
            },
            ExpressionAttributeValues: {
                ":firstName": body.firstName,
                ":lastName": body.lastName,
                ":username": body.username,
                ":isActive": body.isActive,
            },
            ReturnValues: "ALL_NEW",
        };
        const updatedUser = yield dynamoDb.update(updateParams).promise();
        if ((updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.Attributes) &&
            updatedUser.Attributes.role === "student" &&
            "address" in body) {
            const updatedStudent = yield updateStudentInfoByUserId(body.id, body.address, body.dateOfBirth);
            return updatedStudent;
        }
        else {
            return updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.Attributes;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
exports.updateUserRepo = updateUserRepo;
function updateStudentInfoByUserId(userId, address, dateOfBirth) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            TableName: "Student",
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        };
        try {
            const result = yield dynamoDb.scan(params).promise();
            if (result.Items && result.Items[0]) {
                const student = result.Items[0];
                const updateParams = {
                    TableName: "Student",
                    Key: {
                        id: student.id,
                        userId: student.userId,
                    },
                    UpdateExpression: "SET #address = :address, #dateOfBirth = :dateOfBirth",
                    ConditionExpression: "attribute_exists(id)",
                    ExpressionAttributeNames: {
                        "#address": "address",
                        "#dateOfBirth": "dateOfBirth",
                    },
                    ExpressionAttributeValues: {
                        ":address": address,
                        ":dateOfBirth": dateOfBirth,
                    },
                    ReturnValues: "ALL_NEW",
                };
                const updatedStudent = yield dynamoDb.update(updateParams).promise();
                return updatedStudent === null || updatedStudent === void 0 ? void 0 : updatedStudent.Attributes;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error("Error scanning the table:", error);
            throw error;
        }
    });
}
exports.updateStudentInfoByUserId = updateStudentInfoByUserId;
