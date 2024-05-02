"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLoginBody = exports.generatePass = exports.generateUserName = exports.parseBody = void 0;
const uuid_1 = require("uuid");
const parseBody = (event) => {
    if (typeof event.body === "string") {
        const eventObj = JSON.parse(event.body) || "";
        return checkRequestBody(eventObj);
    }
    else if (checkRequestBody(event.body)) {
        return parseRequestBody(event.body);
    }
    return null;
};
exports.parseBody = parseBody;
function checkRequestBody(body) {
    if (!("role" in body))
        return null;
    if ("role" in body && body["role"] === "student") {
        return hasRequiredProperties(body, ["firstName", "lastName", "email"]);
    }
    else {
        return hasRequiredProperties(body, [
            "firstName",
            "lastName",
            "email",
            "specialization",
        ]);
    }
}
function hasRequiredProperties(obj, properties) {
    if (typeof obj !== "object")
        return null;
    for (const prop of properties) {
        if (!(prop in obj))
            return null;
    }
    return obj;
}
function parseRequestBody(body) {
    if (body["role"] === "student") {
        return {
            firstName: body["firstName"],
            lastName: body["lastName"],
            email: body["email"],
            address: body["address"],
            dateOfBirth: body["dateOfBirth"],
            role: body["role"],
        };
    }
    return {
        firstName: body["firstName"],
        lastName: body["lastName"],
        email: body["email"],
        specialization: body["specialization"],
        role: body["role"],
    };
}
const generateUserName = (firstName, lastName) => {
    return firstName + "_" + lastName + "_" + Math.round(Math.random() * 1000);
};
exports.generateUserName = generateUserName;
const generatePass = () => {
    return (0, uuid_1.v4)().substring(0, 8);
};
exports.generatePass = generatePass;
const parseLoginBody = (event) => {
    let email;
    let password;
    if (typeof event.body === "string") {
        const eventObj = JSON.parse(event.body) || "";
        email = eventObj.email;
        password = eventObj.password;
        return { email, password };
    }
    else if (event.body &&
        typeof event.body === "object" &&
        "password" in event.body &&
        "email" in event.body) {
        email = event.body["email"];
        password = event.body["password"];
        return { email, password };
    }
    return { email: "", password: "" };
};
exports.parseLoginBody = parseLoginBody;
