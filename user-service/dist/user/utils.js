"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBodyReturnId = exports.parseBodyUpdatePhoto = exports.parseBody = void 0;
const parseBody = (event) => {
    try {
        let id;
        let password;
        let newPassword;
        if (typeof event.body === "string") {
            const eventObj = JSON.parse(event.body) || "";
            id = eventObj.id;
            password = eventObj.password;
            newPassword = eventObj.newPassword;
            return { id, password, newPassword };
        }
        else if (event.body &&
            typeof event.body === "object" &&
            "id" in event.id &&
            "password" in event.password &&
            "newPassword" in event.newPassword) {
            id = event.body["id"];
            password = event.body["password"];
            newPassword = event.body["newPassword"];
            return { id, password, newPassword };
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
    return null;
};
exports.parseBody = parseBody;
const parseBodyUpdatePhoto = (event) => {
    try {
        let id;
        let photoUrl;
        if (typeof event.body === "string") {
            const eventObj = JSON.parse(event.body) || "";
            id = eventObj.id;
            photoUrl = eventObj.photoUrl;
            return { id, photoUrl };
        }
        else if (event.body &&
            typeof event.body === "object" &&
            "id" in event.id &&
            "password" in event.password &&
            "newPassword" in event.newPassword) {
            id = event.body["id"];
            photoUrl = event.body["photoUrl"];
            return { id, photoUrl };
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
    return null;
};
exports.parseBodyUpdatePhoto = parseBodyUpdatePhoto;
const parseBodyReturnId = (event) => {
    try {
        let id;
        if (typeof event.body === "string") {
            const eventObj = JSON.parse(event.body) || "";
            id = eventObj.id;
            return id;
        }
        else if (event.body &&
            typeof event.body === "object" &&
            "id" in event.id) {
            id = event.body["id"];
            return id;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
    return event;
};
exports.parseBodyReturnId = parseBodyReturnId;
