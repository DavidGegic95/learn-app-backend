import { parseBody } from "../utils";

describe("parseBody", () => {
  it("should return null if event body is not a string or object", () => {
    const event = { body: 123 };
    const result = parseBody(event);
    expect(result).toBeNull();
  });

  it("should return parsed object if event body is a valid stringified object", () => {
    const event = {
      body: '{"id": "123", "password": "oldPassword", "newPassword": "newPassword"}',
    };
    const result = parseBody(event);
    expect(result).toEqual({
      id: "123",
      password: "oldPassword",
      newPassword: "newPassword",
    });
  });

  it("should return null if an error occurs during parsing", () => {
    const event = { body: "{invalid json}" };
    const result = parseBody(event);
    expect(result).toBeNull();
  });
});
