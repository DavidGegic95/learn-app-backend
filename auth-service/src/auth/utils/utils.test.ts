import {
  generateUserName,
  generatePass,
  hasRequiredProperties,
  RequestBody,
  checkRequestBody,
} from "./utils";

describe("generateUserName", () => {
  it("should generate a username in the correct format", () => {
    const firstName = "John";
    const lastName = "Doe";
    const userName = generateUserName(firstName, lastName);
    expect(userName).toMatch(/^John_Doe_\d{1,4}$/);
  });
});

describe("generatePass", () => {
  it("should generate a password with 8 characters", () => {
    const password = generatePass();
    expect(password.length).toBe(8);
  });
});

describe("hasRequiredProperties", () => {
  it("should return object if object has required properties", () => {
    const obj: RequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      address: "123 Main St",
      dateOfBirth: "1990-01-01",
      role: "user",
      specialization: "developer",
    };
    const result = hasRequiredProperties(obj as RequestBody, [
      "firstName",
      "lastName",
      "email",
    ]);
    expect(result).toBe(obj);
  });
});

describe("checkRequestBody", () => {
  it("should return null if role is missing in the body", () => {
    const body = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    };
    const result = checkRequestBody(body as RequestBody);
    expect(result).toBeNull();
  });

  it("should return null if role is student and required properties are missing", () => {
    const body = {
      firstName: "John",
      lastName: "Doe",
      role: "student",
    };
    const result = checkRequestBody(body as RequestBody);
    expect(result).toBeNull();
  });

  it("should return null if role is not student and required properties are missing", () => {
    const body: RequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "trainer",
    };
    const result = checkRequestBody(body);
    expect(result).toBeNull();
  });

  it("should return body if role is student and all required properties are present", () => {
    const body: RequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "student",
    };
    const result = checkRequestBody(body);
    expect(result).toEqual(body);
  });

  it("should return body if role is trainer and all required properties are present", () => {
    const body: RequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "trainer",
      specialization: "Math",
    };
    const result = checkRequestBody(body);
    expect(result).toEqual(body);
  });
});
