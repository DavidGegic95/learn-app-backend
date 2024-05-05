import { auth } from "./index";
import { login } from "./auth/login";
import { logout } from "./auth/logout";
import { register } from "./auth/register";

jest.mock("./auth/login");
jest.mock("./auth/logout");
jest.mock("./auth/register");

describe("auth", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 404 status code if action is not found", async () => {
    const event = { pathParameters: {} };
    const result = await auth(event);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual(JSON.stringify({ message: "Not Found" }));
  });

  it("should return the result of the login function if action is 'login' and HTTP method is 'POST'", async () => {
    const event = { pathParameters: { action: "login" }, httpMethod: "POST" };
    const expectedResult = { statusCode: 200, body: "Login successful" };
    (login as jest.Mock).mockResolvedValue(expectedResult);

    const result = await auth(event);

    expect(result).toEqual(expectedResult);
  });

  it("should return the result of the logout function if action is 'logout' and HTTP method is 'GET'", async () => {
    const event = { pathParameters: { action: "logout" }, httpMethod: "GET" };
    const expectedResult = { statusCode: 200, body: "Logout successful" };
    (logout as jest.Mock).mockResolvedValue(expectedResult);

    const result = await auth(event);

    expect(result).toEqual(expectedResult);
  });

  it("should return the result of the register function if action is 'register' and HTTP method is 'POST'", async () => {
    const event = {
      pathParameters: { action: "register" },
      httpMethod: "POST",
    };
    const expectedResult = { statusCode: 200, body: "Registration successful" };
    (register as jest.Mock).mockResolvedValue(expectedResult);

    const result = await auth(event);

    expect(result).toEqual(expectedResult);
  });
});
