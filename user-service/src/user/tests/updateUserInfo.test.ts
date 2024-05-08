import { APIGatewayProxyResult } from "aws-lambda";
import { updateUserInfo } from "../updateUserInfo";
import { updateUserRepo } from "../../repository/updateUserInfoRepo";

jest.mock("../../repository/updateUserInfoRepo", () => ({
  updateUserRepo: jest.fn(),
}));

describe("updateUserInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if request body is missing required parameters", async () => {
    const event = {
      body: JSON.stringify({}),
    };
    const result = await updateUserInfo(event);
    expect(result.statusCode).toEqual(400);
    expect(JSON.parse(result.body)).toEqual({
      message: "Required request body, or corresponding parameters missing",
    });
  });

  it("should return 400 if updateUserRepo returns falsy", async () => {
    const event = {
      body: JSON.stringify({
        id: "someId",
        role: "someRole",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
      }),
    };
    (updateUserRepo as jest.Mock).mockResolvedValueOnce(false);
    const result = await updateUserInfo(event);
    expect(result.statusCode).toEqual(400);
    expect(JSON.parse(result.body)).toEqual({
      message: "Failed to update user",
    });
  });

  it("should return 200 if updateUserRepo returns truthy", async () => {
    const updatedUser = {
      id: "someId",
      role: "someRole",
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
    };
    const event = {
      body: JSON.stringify(updatedUser),
    };
    (updateUserRepo as jest.Mock).mockResolvedValueOnce(updatedUser);
    const result = await updateUserInfo(event);
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual({
      message: "Update successful",
      user: updatedUser,
    });
  });

  it("should return 500 if an error occurs", async () => {
    const event = {
      body: JSON.stringify({
        id: "someId",
        role: "someRole",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
      }),
    };
    (updateUserRepo as jest.Mock).mockRejectedValueOnce(
      new Error("Test error")
    );
    const result = await updateUserInfo(event);
    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body)).toEqual({
      message: "Internal server error",
    });
  });
});
