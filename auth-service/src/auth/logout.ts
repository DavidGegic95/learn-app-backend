import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { logoutUserRepo } from "./repository/logoutRepo";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const logout = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.queryStringParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Email is required" }),
      };
    }
    const updatedUser = await logoutUserRepo(id);
    if (!updatedUser) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Bad request, user with id does not exist.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Logout successful",
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
