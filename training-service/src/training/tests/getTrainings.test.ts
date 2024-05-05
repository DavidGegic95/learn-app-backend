import { APIGatewayProxyResult } from "aws-lambda";
import { getTrainings } from "../getTrainings";
import { getTrainingsRepo } from "../../repository/getTrainingsRepo";

jest.mock("../../repository/getTrainingsRepo");

describe("getTrainings", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a success response with trainings list if trainings exist", async () => {
    const mockTrainingsList = [{ id: "1", name: "Training 1" }];
    (getTrainingsRepo as jest.Mock).mockResolvedValue(mockTrainingsList);

    const result = await getTrainings();

    expect(getTrainingsRepo).toHaveBeenCalled();
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Get list of trainings.",
        data: mockTrainingsList,
      })
    );
  });

  it("should return a success response with message if no trainings exist", async () => {
    (getTrainingsRepo as jest.Mock).mockResolvedValue([]);

    const result = await getTrainings();

    expect(getTrainingsRepo).toHaveBeenCalled();
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "There is no trainings in db.",
      })
    );
  });

  it("should return a 500 status code and internal server error message if an error occurs", async () => {
    (getTrainingsRepo as jest.Mock).mockRejectedValue(new Error("Mock error"));

    const result = await getTrainings();

    expect(getTrainingsRepo).toHaveBeenCalled();
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });
});
