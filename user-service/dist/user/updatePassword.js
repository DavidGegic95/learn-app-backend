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
exports.updatePassword = void 0;
const updatePasswordRepo_1 = require("../repository/updatePasswordRepo");
const utils_1 = require("./utils");
const updatePassword = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = (0, utils_1.parseBody)(event);
        if (!body || !body.id || !body.password || !body.newPassword) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Required request body, or corresponding paramaters missing",
                }),
            };
        }
        const user = yield (0, updatePasswordRepo_1.checkUser)(body.id);
        if (!user || !user.password) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "User or password not found" }),
            };
        }
        if (user.password !== body.password) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Please enter valid password.",
                }),
            };
        }
        if (user.password === body.newPassword) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Please enter new password, old and new password are same.",
                }),
            };
        }
        const updateUser = yield (0, updatePasswordRepo_1.updatePasswordRepo)(body.id, body.newPassword);
        if (!updateUser) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "54 line" }),
            };
        }
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "update password",
                user: updateUser,
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
exports.updatePassword = updatePassword;
