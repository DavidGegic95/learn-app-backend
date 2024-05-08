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
exports.getStudentByUserId = exports.getSpecializationById = exports.getTrainerById = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
function getTrainerById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            TableName: "Trainer",
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": id,
            },
        };
        try {
            const result = yield dynamoDb.scan(params).promise();
            if (result.Items && result.Items[0]) {
                const trainer = result.Items[0];
                const specializatioObj = yield getSpecializationById(trainer.specializationId);
                return {
                    specialization: specializatioObj === null || specializatioObj === void 0 ? void 0 : specializatioObj.specialization,
                };
            }
        }
        catch (error) {
            console.error("Error scanning the table:", error);
            throw error;
        }
    });
}
exports.getTrainerById = getTrainerById;
function getSpecializationById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            TableName: "Specialization",
            Key: {
                id: id,
            },
        };
        try {
            const result = yield dynamoDb.get(params).promise();
            return result.Item;
        }
        catch (error) {
            console.error("Error getting the item:", error);
            throw error;
        }
    });
}
exports.getSpecializationById = getSpecializationById;
function getStudentByUserId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            TableName: "Student",
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": id,
            },
        };
        try {
            const result = yield dynamoDb.scan(params).promise();
            if (result.Items && result.Items[0]) {
                const student = result.Items[0];
                return {
                    address: student.address,
                    dateOfBirth: student.dateOfBirth,
                    studentId: student.id,
                };
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
exports.getStudentByUserId = getStudentByUserId;
