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
exports.handler = void 0;
const getTrainings_1 = require("./training/getTrainings");
const createTraining_1 = require("./training/createTraining");
const searchTrainings_1 = require("./training/searchTrainings");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = event.pathParameters || {};
    if (!action && event.httpMethod === "GET") {
        return (0, getTrainings_1.getTrainings)();
    }
    else if (!action && event.httpMethod === "POST") {
        return (0, createTraining_1.createTraining)(event);
    }
    else if (action === "search" && event.httpMethod === "GET") {
        return (0, searchTrainings_1.searchTrainings)(event);
    }
    return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
    };
});
exports.handler = handler;
