import { APIGatewayProxyResult } from "aws-lambda";
import { register } from "../register";
import { checkEmail, registerUser } from "../repository/registerRepo";
import { parseBody } from "../utils/utils";

jest.mock("../repository/registerRepo");
jest.mock("../utils/utils");

describe("register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 400 status code if request body is missing", async () => {
    (parseBody as jest.Mock).mockReturnValueOnce(null);

    const result = await register({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Required request body, or corresponding paramaters missing",
      })
    );
  });

  it("should return a 409 status code if user with email already exists", async () => {
    (parseBody as jest.Mock).mockReturnValueOnce({
      email: "test@example.com",
    });
    (checkEmail as jest.Mock).mockResolvedValueOnce(false);

    const result = await register({});

    expect(result.statusCode).toBe(409);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "User with email test@example.com already exist.",
      })
    );
  });

  it("should return a 500 status code if failed to add user", async () => {
    (parseBody as jest.Mock).mockReturnValueOnce({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });
    (checkEmail as jest.Mock).mockResolvedValueOnce(true);
    (registerUser as jest.Mock).mockReturnValueOnce(null);

    const result = await register({});

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Failed to add user",
      })
    );
  });

  it("should return a 200 status code and success message if user is added successfully", async () => {
    (parseBody as jest.Mock).mockReturnValueOnce({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });
    (checkEmail as jest.Mock).mockResolvedValueOnce(true);
    (registerUser as jest.Mock).mockReturnValueOnce({
      userid: "123",
      username: "johndoe",
      password: "password",
    });

    const result = await register({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "User added successfully",
      })
    );
  });

  it("should return a 500 status code if an error occurs", async () => {
    (parseBody as jest.Mock).mockReturnValueOnce({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });
    (checkEmail as jest.Mock).mockRejectedValueOnce(new Error("Mock error"));

    const result = await register({});

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Internal server error",
      })
    );
  });
});
