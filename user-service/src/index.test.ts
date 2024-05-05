import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from "./index";
import { getUser } from "./user/getUser";
import { deleteUser } from "./user/deleteUser";
import { uploadPhoto } from "./user/uploadPhoto";
import { updatePassword } from "./user/updatePassword";

jest.mock("./user/getUser");
jest.mock("./user/deleteUser");
jest.mock("./user/uploadPhoto");
jest.mock("./user/updatePassword");

describe("handler", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call getUser function when action is 'me' and httpMethod is GET", async () => {
    const event = {
      pathParameters: { action: "me" },
      httpMethod: "GET",
    };
    await handler(event);

    expect(getUser).toHaveBeenCalledWith(event);
  });

  it("should call deleteUser function when action is 'me' and httpMethod is DELETE", async () => {
    const event = {
      pathParameters: { action: "me" },
      httpMethod: "DELETE",
    };
    await handler(event);

    expect(deleteUser).toHaveBeenCalledWith(event);
  });

  it("should call uploadPhoto function when action is 'upload-photo' and httpMethod is POST", async () => {
    const event = {
      pathParameters: { action: "upload-photo" },
      httpMethod: "POST",
    };
    await handler(event);

    expect(uploadPhoto).toHaveBeenCalledWith(event);
  });

  it("should call updatePassword function when action is 'update-password' and httpMethod is PUT", async () => {
    const event = {
      pathParameters: { action: "update-password" },
      httpMethod: "PUT",
    };
    await handler(event);

    expect(updatePassword).toHaveBeenCalledWith(event);
  });

  it("should return a 404 status code and 'Not Found' message if no valid route is found", async () => {
    const event = {
      pathParameters: { action: "invalid" },
      httpMethod: "GET",
    };
    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual(JSON.stringify({ message: "Not Found" }));
  });
});
