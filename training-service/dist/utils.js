"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBodyReturnTrainingObj = void 0;
const requiredPropsBody = [
    "id",
    "studentId",
    "trainerId",
    "name",
    "type",
    "date",
    "duration",
    "description",
];
const parseBodyReturnTrainingObj = (event) => {
    const obj = {
        id: "",
        studentId: "",
        trainerId: "",
        name: "",
        type: {
            id: "",
            trainingType: "",
        },
        date: "",
        duration: 0,
        description: "",
    };
    if (typeof event.body === "string") {
        const body = JSON.parse(event.body) || "";
        obj.id = body.id;
        obj.studentId = body.studentId;
        obj.trainerId = body.trainerId;
        obj.type = body.type;
        obj.name = body.name;
        obj.date = body.date;
        obj.duration = body.duration;
        obj.description = body.description;
        if (hasRequiredProperties(obj, requiredPropsBody)) {
            return obj;
        }
    }
    else if (event.body &&
        typeof event.body === "object" &&
        "id" in event.body &&
        "studentId" in event.body &&
        "trainerId" in event.body &&
        "type" in event.body &&
        "name" in event.body &&
        "date" in event.body &&
        "duration" in event.body &&
        "description" in event.body) {
        const { body } = event;
        obj.id = body["id"];
        obj.studentId = body["studentId"];
        obj.trainerId = body["trainerId"];
        obj.name = body["name"];
        obj.date = body["type"];
        obj.date = body["date"];
        obj.duration = body["duration"];
        obj.description = body["description"];
        if (!("id" in obj.type && "trainingType" in obj.type))
            return null;
    }
    if (hasRequiredProperties(obj, requiredPropsBody)) {
        return obj;
    }
    return null;
};
exports.parseBodyReturnTrainingObj = parseBodyReturnTrainingObj;
function hasRequiredProperties(obj, properties) {
    if (typeof obj !== "object")
        return false;
    for (const prop of properties) {
        if (!(prop in obj && obj[prop]))
            return false;
    }
    return true;
}
