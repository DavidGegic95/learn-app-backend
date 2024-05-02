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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dynamoDb = new aws_sdk_1.default.DynamoDB.DocumentClient();
const login = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let email;
        let password;
        if (typeof event.body === "string") {
            const eventObj = JSON.parse(event.body) || "";
            email = eventObj.email;
            password = eventObj.password;
        }
        else if (event.body &&
            typeof event.body === "object" &&
            "password" in event.body &&
            "email" in event.body) {
            email = event.body["email"];
            password = event.body["password"];
        }
        else {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Required request body, or corresponding paramaters missing",
                }),
            };
        }
        // const params = {
        //   TableName: "Email",
        //   Key: {
        //     email: email,
        //   },
        // };
        // const data = await dynamoDb.get(params).promise();
        // if (!data.Item) {
        //   return {
        //     statusCode: 404,
        //     body: JSON.stringify({ message: "User not found" }),
        //   };
        // }
        const params = {
            TableName: "User",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email,
            },
        };
        // const paramsUser = {
        //   TableName: "User",
        //   Key: {
        //     id: data.Item.id,
        //   },
        // };
        const user = yield dynamoDb.scan(params).promise();
        if (user.Items && user.Items.length === 0) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    message: `User with email ${email} not found`,
                }),
            };
        }
        const storedPassword = user.Items[0].password;
        if (password !== storedPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid password" }),
            };
        }
        const updateParams = {
            TableName: "User",
            Key: {
                id: (_a = user === null || user === void 0 ? void 0 : user.Items[0]) === null || _a === void 0 ? void 0 : _a.id,
            },
            UpdateExpression: "SET #isActive = :isActive",
            ConditionExpression: "attribute_exists(email)",
            ExpressionAttributeNames: {
                "#isActive": "isActive",
            },
            ExpressionAttributeValues: {
                ":isActive": true,
            },
            ReturnValues: "ALL_NEW",
        };
        const updatedUser = yield dynamoDb.update(updateParams).promise();
        const token = jsonwebtoken_1.default.sign({ email: email }, "your_secret_key", {
            expiresIn: "1h",
        });
        return {
            statusCode: 200,
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
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
});
exports.login = login;
