import { APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import {
  RequestBody,
  generatePass,
  generateUserName,
  parseBody,
} from "./utils/utils";
import { v4 as uuidv4 } from "uuid";
import { checkEmail, registerUser } from "./repository/registerRepo";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const register = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody: RequestBody | null = parseBody(event);
    if (!requestBody) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Required request body, or corresponding paramaters missing",
        }),
      };
    }

    const existingUser = await checkEmail(requestBody.email);

    if (!existingUser) {
      return {
        statusCode: 409,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: `User with email ${requestBody.email} already exist.`,
        }),
      };
    }

    const userName = generateUserName(
      requestBody.firstName,
      requestBody.lastName
    );
    const password = generatePass();
    const userId = uuidv4();

    //
    const user = await registerUser(userId, userName, password, requestBody);
    if (!user) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Failed to add user" }),
      };
    }
    //
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "User added successfully",
        username: userName,
        password: password,
      }),
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
