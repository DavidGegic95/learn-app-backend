import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const logout = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const email = event.queryStringParameters?.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email is required" }),
      };
    }

    const params = {
      TableName: "Users",
      Key: {
        email: email,
      },
      UpdateExpression: "SET #isActive = :isActive",
      ConditionExpression: "attribute_exists(email)",
      ExpressionAttributeNames: {
        "#isActive": "isActive",
      },
      ExpressionAttributeValues: {
        ":isActive": false,
      },
      ReturnValues: "ALL_NEW",
    };

    let updatedUser;
    try {
      updatedUser = await dynamoDb.update(params).promise();
    } catch (error: any) {
      if (error.code === "ConditionalCheckFailedException") {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Bad request, user with email does not exist.",
          }),
        };
      }
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Logout successful",
        user: updatedUser.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
