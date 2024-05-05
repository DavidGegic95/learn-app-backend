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
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginRepo_1 = require("./repository/loginRepo");
const utils_1 = require("./utils/utils");
const login = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = (0, utils_1.parseLoginBody)(event);
        if (!email || !password) {
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
        //
        const user = yield (0, loginRepo_1.findUser)(email);
        if (!user || (user.Items && user.Items.length === 0)) {
            return {
                statusCode: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: `User with email ${email} not found`,
                }),
            };
        }
        //
        const storedPassword = user.Items[0].password;
        if (password !== storedPassword) {
            return {
                statusCode: 401,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "Invalid password" }),
            };
        }
        //
        const updatedUser = yield (0, loginRepo_1.updateUser)(user === null || user === void 0 ? void 0 : user.Items[0].id);
        if (!updatedUser) {
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    message: "Internal server error, unable to update active status",
                }),
            };
        }
        //
        const token = jsonwebtoken_1.default.sign({ email: email }, "your_secret_key", {
            expiresIn: "1h",
        });
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message: "Login successful",
                token: token,
                user: updatedUser.Attributes,
            }),
        };
    }
    catch (error) {
        console.error("Error logging in:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
});
exports.login = login;
