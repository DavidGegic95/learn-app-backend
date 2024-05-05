import { APIGatewayProxyResult } from "aws-lambda";
import { Training, parseBodyReturnTrainingObj } from "../utils";
import { createTrainingRepo } from "../repository/createTrainingRepo";

export const createTraining = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  try {
    const parsedBody: Training | null = parseBodyReturnTrainingObj(event);
    if (!parsedBody) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Invalid request body and its parameters",
        }),
      };
    }

    const createdTraining = await createTrainingRepo(parsedBody);
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Training succesfuly created",
        data: createdTraining?.Attributes,
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
