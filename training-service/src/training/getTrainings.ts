import { APIGatewayProxyResult } from "aws-lambda";
import { getTrainingsRepo } from "../repository/getTrainingsRepo";

export const getTrainings = async (): Promise<APIGatewayProxyResult> => {
  try {
    const allTrainingsList = await getTrainingsRepo();
    if (allTrainingsList?.length === 0) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "There is no trainings in db.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Get list of trainings.",
        data: allTrainingsList,
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
