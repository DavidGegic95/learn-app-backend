import { APIGatewayProxyResult } from "aws-lambda";
import { getTrainings } from "./training/getTrainings";
import { createTraining } from "./training/createTraining";
import { searchTrainings } from "./training/searchTrainings";

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const { action } = event.pathParameters || {};

  if (!action && event.httpMethod === "GET") {
    return getTrainings();
  } else if (!action && event.httpMethod === "POST") {
    return createTraining(event);
  } else if (action === "search" && event.httpMethod === "GET") {
    return searchTrainings(event);
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Not Found" }),
  };
};
