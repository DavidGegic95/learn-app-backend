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
exports.searchTrainings = void 0;
const searchTrainingsRepo_1 = require("../repository/searchTrainingsRepo");
const searchTrainings = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchParams, value } = event.queryStringParameters;
        if (!searchParams || !value) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Body or coresponding values missing.",
                }),
            };
        }
        let trainignList;
        switch (searchParams) {
            case "name":
                trainignList = yield (0, searchTrainingsRepo_1.getTrainingsByName)(value);
                break;
            case "specialization":
                trainignList = yield (0, searchTrainingsRepo_1.getTrainingsBySpecialization)(value);
                break;
            case "date":
                trainignList = yield (0, searchTrainingsRepo_1.getTrainingsByDate)(value);
                break;
        }
        if (!trainignList || trainignList.length === 0) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "No result for search criteria.",
                }),
            };
        }
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Get user",
                data: trainignList,
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
exports.searchTrainings = searchTrainings;
