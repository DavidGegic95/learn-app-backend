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
const getUser_1 = require("./user/getUser");
const deleteUser_1 = require("./user/deleteUser");
const uploadPhoto_1 = require("./user/uploadPhoto");
const updatePassword_1 = require("./user/updatePassword");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = event.pathParameters || {};
    if (action === "me" && event.httpMethod === "GET") {
        return (0, getUser_1.getUser)(event);
    }
    else if (action === "me" && event.httpMethod === "DELETE") {
        return (0, deleteUser_1.deleteUser)(event);
    }
    else if (action === "upload-photo" && event.httpMethod === "POST") {
        return (0, uploadPhoto_1.uploadPhoto)(event);
    }
    else if (action === "update-password" && event.httpMethod === "PUT") {
        return (0, updatePassword_1.updatePassword)(event);
    }
    return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
    };
});
exports.handler = handler;
