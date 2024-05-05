import { APIGatewayProxyResult } from "aws-lambda";
import { createTraining } from ".././createTraining";
import { parseBodyReturnTrainingObj } from "../../utils";
import { createTrainingRepo } from "../../repository/createTrainingRepo";

jest.mock("../../utils");
jest.mock("../../repository/createTrainingRepo");

describe("createTraining", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 400 status code if the request body is invalid", async () => {
    (parseBodyReturnTrainingObj as jest.Mock).mockReturnValue(null);

    const result = await createTraining({});

    expect(parseBodyReturnTrainingObj).toHaveBeenCalled();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Invalid request body and its parameters",
      })
    );
  });

  it("should return a 201 status code and the created training data if successful", async () => {
    const mockTraining = { id: "1", name: "Training 1" };
    (parseBodyReturnTrainingObj as jest.Mock).mockReturnValue(mockTraining);
    (createTrainingRepo as jest.Mock).mockResolvedValue({
      Attributes: mockTraining,
    });

    const result = await createTraining({});

    expect(parseBodyReturnTrainingObj).toHaveBeenCalled();
    expect(createTrainingRepo).toHaveBeenCalledWith(mockTraining);
    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Training succesfuly created",
        data: mockTraining,
      })
    );
  });

  it("should return a 500 status code and internal server error message if an error occurs", async () => {
    (parseBodyReturnTrainingObj as jest.Mock).mockReturnValue({});
    (createTrainingRepo as jest.Mock).mockRejectedValue(
      new Error("Mock error")
    );

    const result = await createTraining({});

    expect(parseBodyReturnTrainingObj).toHaveBeenCalled();
    expect(createTrainingRepo).toHaveBeenCalled();
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });
});
