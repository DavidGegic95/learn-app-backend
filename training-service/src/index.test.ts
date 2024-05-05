import { handler } from "./index";
import { getTrainings } from "./training/getTrainings";
import { createTraining } from "./training/createTraining";
import { searchTrainings } from "./training/searchTrainings";

jest.mock("./training/getTrainings");
jest.mock("./training/createTraining");
jest.mock("./training/searchTrainings");

describe("handler", () => {
  it("should call getTrainings when action is not provided and method is GET", async () => {
    const event = { httpMethod: "GET", pathParameters: {} };
    await handler(event);
    expect(getTrainings).toHaveBeenCalled();
  });

  it("should call createTraining when action is not provided and method is POST", async () => {
    const event = { httpMethod: "POST", pathParameters: {} };
    await handler(event);
    expect(createTraining).toHaveBeenCalledWith(event);
  });

  it('should call searchTrainings when action is "search" and method is GET', async () => {
    const event = { httpMethod: "GET", pathParameters: { action: "search" } };
    await handler(event);
    expect(searchTrainings).toHaveBeenCalledWith(event);
  });

  it('should return a 404 status code and "Not Found" message if no valid route is found', async () => {
    const event = { httpMethod: "GET", pathParameters: { action: "invalid" } };
    const result = await handler(event);
    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual(JSON.stringify({ message: "Not Found" }));
  });
});
