import { APIGatewayProxyResult } from "aws-lambda";
import {
  getTrainingsByDate,
  getTrainingsByName,
  getTrainingsBySpecialization,
} from "../repository/searchTrainingsRepo";
// Search trainings by trainer name, specialization and date
// from swagger
type TrainingList = string[];
export const searchTrainings = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  try {
    const { searchParams, value } = event.queryStringParameters;
    if (!searchParams || !value) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Body or coresponding values missing.",
        }),
      };
    }
    let trainignList;
    switch (searchParams) {
      case "name":
        trainignList = await getTrainingsByName(value);
        break;
      case "specialization":
        trainignList = await getTrainingsBySpecialization(value);
        break;
      case "date":
        trainignList = await getTrainingsByDate(value);
        break;
    }

    if (!trainignList || trainignList.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "No result for search criteria.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Results for training search.",
        data: trainignList,
      }),
    };
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
