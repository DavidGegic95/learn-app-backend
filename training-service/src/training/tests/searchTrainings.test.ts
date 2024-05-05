import { APIGatewayProxyResult } from "aws-lambda";
import { searchTrainings } from ".././searchTrainings";
import {
  getTrainingsByDate,
  getTrainingsByName,
  getTrainingsBySpecialization,
} from "../../repository/searchTrainingsRepo";

jest.mock("../../repository/searchTrainingsRepo");

describe("searchTrainings", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 400 status code if searchParams or value is missing", async () => {
    const result = await searchTrainings({ queryStringParameters: {} });

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Body or coresponding values missing.",
      })
    );
  });

  it("should return a 400 status code if no results are found for search criteria", async () => {
    (getTrainingsByName as jest.Mock).mockResolvedValue([]);
    const event = {
      queryStringParameters: {
        searchParams: "name",
        value: "John Doe",
      },
    };

    const result = await searchTrainings(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "No result for search criteria.",
      })
    );
  });

  it("should return a 200 status code with search results if successful", async () => {
    const mockTrainingsList = ["Training 1", "Training 2"];
    (getTrainingsByName as jest.Mock).mockResolvedValue(mockTrainingsList);
    const event = {
      queryStringParameters: {
        searchParams: "name",
        value: "John Doe",
      },
    };

    const result = await searchTrainings(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(
      JSON.stringify({
        message: "Results for training search.",
        data: mockTrainingsList,
      })
    );
  });

  it("should return a 500 status code and internal server error message if an error occurs", async () => {
    (getTrainingsByName as jest.Mock).mockRejectedValue(
      new Error("Mock error")
    );
    const event = {
      queryStringParameters: {
        searchParams: "name",
        value: "John Doe",
      },
    };

    const result = await searchTrainings(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(
      JSON.stringify({ message: "Internal server error" })
    );
  });
});
