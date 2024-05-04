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
exports.uploadPhoto = void 0;
const updatePasswordRepo_1 = require("../repository/updatePasswordRepo");
const utils_1 = require("./utils");
const uploadPhotoRepo_1 = require("../repository/uploadPhotoRepo");
const uploadPhoto = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = (0, utils_1.parseBodyUpdatePhoto)(event);
        if (!body || !body.id || !body.photoUrl) {
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
        const user = yield (0, updatePasswordRepo_1.getUserRepo)(body.id);
        if (!user || !user.password) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "User not found" }),
            };
        }
        const updateUser = yield (0, uploadPhotoRepo_1.uploadPhotoRepo)(body.id, body.photoUrl);
        if (!updateUser) {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "Falied to update photo" }),
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
exports.uploadPhoto = uploadPhoto;
