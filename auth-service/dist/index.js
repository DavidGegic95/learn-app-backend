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
exports.auth = void 0;
const login_1 = require("./auth/login");
const logout_1 = require("./auth/logout");
const register_1 = require("./auth/register");
const auth = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = event.pathParameters || {};
    if (action === "login" && event.httpMethod === "POST") {
        return (0, login_1.login)(event);
    }
    else if (action === "logout" && event.httpMethod === "GET") {
        return (0, logout_1.logout)(event);
    }
    else if (action === "register" && event.httpMethod === "POST") {
        return (0, register_1.register)(event);
    }
    return {
        statusCode: 404,
        body: JSON.stringify({ message: "Not Found" }),
    };
});
exports.auth = auth;
