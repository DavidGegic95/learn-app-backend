"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
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