import { APIGatewayProxyResult } from "aws-lambda";
import { updatePassword } from "../updatePassword";
import { parseBody } from "../utils";
import {
  getUserRepo,
  updatePasswordRepo,
} from "../../repository/updatePasswordRepo";

jest.mock("../utils");
jest.mock("../../repository/updatePasswordRepo");

describe("updatePassword", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 400 status code if required parameters are missing in request body", async () => {
    (parseBody as jest.Mock).mockReturnValue({});
    const result = await updatePassword({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Required request body, or corresponding paramaters missing",
      })
    );
  });

  it("should return a 400 status code if user or password is not found", async () => {
    (parseBody as jest.Mock).mockReturnValue({
      id: "123",
      password: "oldPass",
      newPassword: "newPass",
    });
    (getUserRepo as jest.Mock).mockResolvedValue(null);
    const result = await updatePassword({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: "User or password not found" })
    );
  });

  it("should return a 400 status code if old password is incorrect", async () => {
    (parseBody as jest.Mock).mockReturnValue({
      id: "123",
      password: "wrongPass",
      newPassword: "newPass",
    });
    (getUserRepo as jest.Mock).mockResolvedValue({
      id: "123",
      password: "correctPass",
    });
    const result = await updatePassword({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Please enter valid password." })
    );
  });

  it("should return a 400 status code if old and new passwords are the same", async () => {
    (parseBody as jest.Mock).mockReturnValue({
      id: "123",
      password: "oldPass",
      newPassword: "oldPass",
    });
    (getUserRepo as jest.Mock).mockResolvedValue({
      id: "123",
      password: "oldPass",
    });
    const result = await updatePassword({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Please enter new password, old and new password are same.",
      })
    );
  });

  it("should return a 400 status code if updatePasswordRepo fails", async () => {
    (parseBody as jest.Mock).mockReturnValue({
      id: "123",
      password: "oldPass",
      newPassword: "newPass",
    });
    (getUserRepo as jest.Mock).mockResolvedValue({
      id: "123",
      password: "oldPass",
    });
    (updatePasswordRepo as jest.Mock).mockResolvedValue(null);
    const result = await updatePassword({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Failed to update user" })
    );
  });

  it("should return a 200 status code and success message if password is updated successfully", async () => {
    const mockUser = { id: "123", password: "oldPass" };
    (parseBody as jest.Mock).mockReturnValue({
      id: "123",
      password: "oldPass",
      newPassword: "newPass",
    });
    (getUserRepo as jest.Mock).mockResolvedValue(mockUser);
    (updatePasswordRepo as jest.Mock).mockResolvedValue({
      id: "123",
      password: "newPass",
    });
    const result = await updatePassword({});

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "update password",
        user: { id: "123", password: "newPass" },
      })
    );
  });

  it("should return a 500 status code and internal server error message if an error occurs", async () => {
    (parseBody as jest.Mock).mockReturnValue({
      id: "123",
      password: "oldPass",
      newPassword: "newPass",
    });
    (getUserRepo as jest.Mock).mockRejectedValue(new Error("Mock error"));
    const result = await updatePassword({});

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });
});
