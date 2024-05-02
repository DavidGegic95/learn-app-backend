import { v4 as uuidv4 } from "uuid";

export const parseBody = (event: any) => {
  if (typeof event.body === "string") {
    const eventObj: RequestBody = JSON.parse(event.body) || "";
    return checkRequestBody(eventObj);
  } else if (checkRequestBody(event.body)) {
    return parseRequestBody(event.body);
  }
  return null;
};

function checkRequestBody(body: RequestBody) {
  if (!("role" in body)) return null;
  if ("role" in body && body["role"] === "student") {
    return hasRequiredProperties(body, ["firstName", "lastName", "email"]);
  } else {
    return hasRequiredProperties(body, [
      "firstName",
      "lastName",
      "email",
      "specialization",
    ]);
  }
}

function hasRequiredProperties(obj: RequestBody, properties: string[]) {
  if (typeof obj !== "object") return null;
  for (const prop of properties) {
    if (!(prop in obj)) return null;
  }
  return obj;
}
function parseRequestBody(body: RequestBody) {
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

export const generateUserName = (firstName: string, lastName: string) => {
  return firstName + "_" + lastName + "_" + Math.round(Math.random() * 1000);
};

export const generatePass = () => {
  return uuidv4().substring(0, 8);
};
export interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  dateOfBirth?: string;
  role: string;
  specialization?: string;
}
