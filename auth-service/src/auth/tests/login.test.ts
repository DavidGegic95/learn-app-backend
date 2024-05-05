import jwt from "jsonwebtoken";
import { login } from "../login";
import { findUser, updateUser } from "../repository/loginRepo";

jest.mock("jsonwebtoken");
jest.mock("../repository/loginRepo");

describe("login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 400 status code if required parameters are missing in request body", async () => {
    const event = {};
    const result = await login(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Required request body, or corresponding paramaters missing",
      })
    );
  });

  it("should return a 401 status code if user is not found", async () => {
    const event = {
      body: JSON.stringify({ email: "test@example.com", password: "password" }),
    };
    (findUser as jest.Mock).mockReturnValueOnce({ Items: [] });

    const result = await login(event);

    expect(result.statusCode).toBe(401);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "User with email test@example.com not found",
      })
    );
  });

  it("should return a 401 status code if password is invalid", async () => {
    const event = {
      body: JSON.stringify({
        email: "test@example.com",
        password: "invalid_password",
      }),
    };
    (findUser as jest.Mock).mockReturnValueOnce({
      Items: [{ password: "correct_password" }],
    });

    const result = await login(event);

    expect(result.statusCode).toBe(401);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Invalid password",
      })
    );
  });

  it("should return a 500 status code if updateUser fails", async () => {
    const event = {
      body: JSON.stringify({
        email: "test@example.com",
        password: "correct_password",
      }),
    };
    (findUser as jest.Mock).mockReturnValueOnce({
      Items: [{ id: "123", password: "correct_password" }],
    });
    (updateUser as jest.Mock).mockReturnValueOnce(null);

    const result = await login(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Internal server error, unable to update active status",
      })
    );
  });

  it("should return a 200 status code and a token if login is successful", async () => {
    const event = {
      body: JSON.stringify({
        email: "test@example.com",
        password: "correct_password",
      }),
    };
    const mockUpdatedUser = {
      id: "123",
      email: "test@example.com",
      active: true,
    };
    (findUser as jest.Mock).mockReturnValueOnce({
      Items: [{ id: "123", password: "correct_password" }],
    });
    (updateUser as jest.Mock).mockReturnValueOnce({
      Attributes: mockUpdatedUser,
    });
    (jwt.sign as jest.Mock).mockReturnValueOnce("mock_token");

    const result = await login(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Login successful",
        token: "mock_token",
        user: mockUpdatedUser,
      })
    );
  });

  it("should return a 500 status code if an error occurs", async () => {
    const event = {
      body: JSON.stringify({
        email: "test@example.com",
        password: "correct_password",
      }),
    };
    (findUser as jest.Mock).mockRejectedValueOnce(new Error("Mock error"));

    const result = await login(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Internal server error",
      })
    );
  });
});
