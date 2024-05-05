import { APIGatewayProxyResult } from "aws-lambda";
import { getUser } from "../getUser";
import { getUserRepo } from "../../repository/updatePasswordRepo";

jest.mock("../../repository/updatePasswordRepo");

describe("getUser", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 400 status code if id is missing in query parameters", async () => {
    const event = { queryStringParameters: {} };

    const result = await getUser(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Request body and corresponding params missing",
      })
    );
  });

  it("should return a 400 status code if user is not found", async () => {
    const event = { queryStringParameters: { id: "123" } };
    (getUserRepo as jest.Mock).mockResolvedValue(null);

    const result = await getUser(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({ message: "User not found" }));
  });

  it("should return a 200 status code and the user data if user is found", async () => {
    const mockUser = { id: "123", name: "John Doe" };
    const event = { queryStringParameters: { id: "123" } };
    (getUserRepo as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUser(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Get user",
        data: mockUser,
      })
    );
  });

  it("should return a 500 status code and internal server error message if an error occurs", async () => {
    const event = { queryStringParameters: { id: "123" } };
    (getUserRepo as jest.Mock).mockRejectedValue(new Error("Mock error"));

    const result = await getUser(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });
});
