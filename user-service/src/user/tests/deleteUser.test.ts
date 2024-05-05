import { deleteUser } from "../deleteUser";
import { parseBodyReturnId } from "../utils";
import { deleteUserRepo } from "../../repository/deleteUserRepo";

jest.mock("../utils");
jest.mock("../../repository/deleteUserRepo");

describe("deleteUser", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 400 status code if id is missing in request body", async () => {
    (parseBodyReturnId as jest.Mock).mockReturnValue(null);

    const result = await deleteUser({});

    expect(parseBodyReturnId).toHaveBeenCalled();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Request body and corresponding params missing",
      })
    );
  });

  it("should return a 400 status code if user cannot be found or deleted", async () => {
    (parseBodyReturnId as jest.Mock).mockReturnValue("123");
    (deleteUserRepo as jest.Mock).mockResolvedValue(null);

    const result = await deleteUser({});

    expect(parseBodyReturnId).toHaveBeenCalled();
    expect(deleteUserRepo).toHaveBeenCalledWith("123");
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Cannot find or delete user",
      })
    );
  });

  it("should return a 200 status code and success message if user is deleted successfully", async () => {
    (parseBodyReturnId as jest.Mock).mockReturnValue("123");
    (deleteUserRepo as jest.Mock).mockResolvedValue(true);

    const result = await deleteUser({});

    expect(parseBodyReturnId).toHaveBeenCalled();
    expect(deleteUserRepo).toHaveBeenCalledWith("123");
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "User deleted successfully",
      })
    );
  });

  it("should return a 500 status code and internal server error message if an error occurs", async () => {
    (parseBodyReturnId as jest.Mock).mockReturnValue("123");
    (deleteUserRepo as jest.Mock).mockRejectedValue(new Error("Mock error"));

    const result = await deleteUser({});

    expect(parseBodyReturnId).toHaveBeenCalled();
    expect(deleteUserRepo).toHaveBeenCalledWith("123");
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });
});
