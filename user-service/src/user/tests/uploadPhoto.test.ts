import { APIGatewayProxyResult } from "aws-lambda";
import { uploadPhoto } from "../uploadPhoto";
import { parseBodyUpdatePhoto } from "../utils";
import { getUserRepo } from "../../repository/updatePasswordRepo";
import { uploadPhotoRepo } from "../../repository/uploadPhotoRepo";

jest.mock("../utils");
jest.mock("../../repository/updatePasswordRepo");
jest.mock("../../repository/uploadPhotoRepo");

describe("uploadPhoto", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 400 status code if required parameters are missing in request body", async () => {
    (parseBodyUpdatePhoto as jest.Mock).mockReturnValue({});
    const result = await uploadPhoto({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Required request body, or corresponding parameters missing",
      })
    );
  });

  it("should return a 400 status code if user is not found", async () => {
    (parseBodyUpdatePhoto as jest.Mock).mockReturnValue({
      id: "123",
      photoUrl: "url",
    });
    (getUserRepo as jest.Mock).mockResolvedValue(null);
    const result = await uploadPhoto({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({ message: "User not found" }));
  });

  it("should return a 400 status code if uploadPhotoRepo fails", async () => {
    (parseBodyUpdatePhoto as jest.Mock).mockReturnValue({
      id: "123",
      photoUrl: "url",
    });
    (getUserRepo as jest.Mock).mockResolvedValue({
      id: "123",
      password: "pass",
    });
    (uploadPhotoRepo as jest.Mock).mockResolvedValue(null);
    const result = await uploadPhoto({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Failed to update photo" })
    );
  });

  it("should return a 200 status code and success message if photo is updated successfully", async () => {
    const mockUser = { id: "123", password: "pass" };
    (parseBodyUpdatePhoto as jest.Mock).mockReturnValue({
      id: "123",
      photoUrl: "url",
    });
    (getUserRepo as jest.Mock).mockResolvedValue(mockUser);
    (uploadPhotoRepo as jest.Mock).mockResolvedValue({
      id: "123",
      photoUrl: "url",
    });
    const result = await uploadPhoto({});

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "update password",
        user: { id: "123", photoUrl: "url" },
      })
    );
  });

  it("should return a 500 status code and internal server error message if an error occurs", async () => {
    (parseBodyUpdatePhoto as jest.Mock).mockReturnValue({
      id: "123",
      photoUrl: "url",
    });
    (getUserRepo as jest.Mock).mockRejectedValue(new Error("Mock error"));
    const result = await uploadPhoto({});

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });
});
