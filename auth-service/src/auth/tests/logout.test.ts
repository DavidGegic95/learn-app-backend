import { APIGatewayProxyEvent } from "aws-lambda";
import { logout } from "../logout";
import { logoutUserRepo } from "../repository/logoutRepo";

jest.mock("aws-sdk");
jest.mock("../repository/logoutRepo");

describe("logout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 400 status code if email is missing", async () => {
    const event = { queryStringParameters: {} } as APIGatewayProxyEvent;
    const result = await logout(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Email is required" })
    );
  });

  it("should return a 400 status code if user with id does not exist", async () => {
    const event = {
      queryStringParameters: { id: "test-id" },
    };
    (logoutUserRepo as jest.Mock).mockReturnValueOnce(null);

    const result = await logout(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Bad request, user with id does not exist.",
      })
    );
  });

  it("should return a 200 status code and success message if logout is successful", async () => {
    const event = {
      queryStringParameters: { id: "test-id" },
    };
    (logoutUserRepo as jest.Mock).mockReturnValueOnce({ id: "test-id" });

    const result = await logout(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Logout successful",
      })
    );
  });

  it("should return a 500 status code if an error occurs", async () => {
    const event = {
      queryStringParameters: { id: "test-id" },
    };
    (logoutUserRepo as jest.Mock).mockRejectedValueOnce(
      new Error("Mock error")
    );

    const result = await logout(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Internal server error",
      })
    );
  });
});
