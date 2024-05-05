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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTraining = void 0;
const utils_1 = require("../utils");
const createTrainingRepo_1 = require("../repository/createTrainingRepo");
const createTraining = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = (0, utils_1.parseBodyReturnTrainingObj)(event);
        if (!parsedBody) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Invalid request body and its parameters",
                }),
            };
        }
        const createdTraining = yield (0, createTrainingRepo_1.createTrainingRepo)(parsedBody);
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Training succesfuly created",
                data: createdTraining === null || createdTraining === void 0 ? void 0 : createdTraining.Attributes,
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
exports.createTraining = createTraining;
