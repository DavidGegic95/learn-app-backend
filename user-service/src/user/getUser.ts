import { APIGatewayProxyResult } from "aws-lambda";
import { parseBodyReturnId } from "./utils";
import { getUserRepo } from "../repository/updatePasswordRepo";

export const getUser = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.queryStringParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Request body and corresponding params missing",
        }),
      };
    }
    const user = await getUserRepo(id);
    if (!user) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Get user",
        data: { ...user },
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
