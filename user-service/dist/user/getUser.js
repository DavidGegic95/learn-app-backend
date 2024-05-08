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
exports.getUser = void 0;
const updatePasswordRepo_1 = require("../repository/updatePasswordRepo");
const getUserRepo_1 = require("../repository/getUserRepo");
const getUser = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Id or role params missing",
                }),
            };
        }
        const user = yield (0, updatePasswordRepo_1.getUserRepo)(id);
        if (!user) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "User not found" }),
            };
        }
        let additionalInfo = {};
        if (user.role === "trainer") {
            const trainerInfo = yield (0, getUserRepo_1.getTrainerById)(id);
            additionalInfo = Object.assign({}, trainerInfo);
        }
        else {
            const studentInfo = yield (0, getUserRepo_1.getStudentByUserId)(id);
            additionalInfo = Object.assign({}, studentInfo);
        }
        delete user.password;
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Get user",
                data: Object.assign(Object.assign({}, user), additionalInfo),
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
exports.getUser = getUser;
