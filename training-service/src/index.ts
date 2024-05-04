import { APIGatewayProxyResult } from "aws-lambda";
import { getTrainings } from "./training/getTrainings";

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const { action } = event.pathParameters || {};

  if (!action && event.httpMethod === "GET") {
    return getTrainings();
  } else if (!action && event.httpMethod === "POST") {
    // return uploadPhoto(event);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Post and undefined" }),
    };
  } else if (action === "search" && event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Get and search" }),
    };
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Not Found" }),
  };
};
