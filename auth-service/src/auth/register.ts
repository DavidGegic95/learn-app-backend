import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import {
  RequestBody,
  generatePass,
  generateUserName,
  parseBody,
} from "./utils";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const register = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody: RequestBody | null = parseBody(event);
    const userId = uuidv4();
    if (!requestBody) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Required request body, or corresponding paramaters missing",
        }),
      };
    }
    const userName = generateUserName(
      requestBody.firstName,
      requestBody.lastName
    );
    const password = generatePass();
    const params = {
      TableName: "User",
      Item: {
        id: userId,
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        email: requestBody.email,
        isActive: false,
        username: userName,
        photo: "",
        password: password,
      },
    };
    const studentParams = {
      TableName: "Student",
      Item: {
        id: uuidv4(),
        userId: userId,
        dateOfBirth: requestBody.dateOfBirth || "",
        address: requestBody.address || "",
      },
    };

    const emailParams = {
      TableName: "Email",
      Item: {
        email: requestBody.email,
        id: userId,
      },
    };
    const specializationParams = {
      TableName: "Specialization",
      FilterExpression: "specialization = :specialization",
      ExpressionAttributeValues: {
        ":specialization": requestBody.specialization,
      },
    };

    try {
      const user = await dynamoDb.put(params).promise();
      if (requestBody.role === "student") {
        await Promise.all([
          dynamoDb.put(studentParams).promise(),
          dynamoDb.put(emailParams).promise(),
        ]);
      } else {
        const spec = await dynamoDb.scan(specializationParams).promise();
        let specId = "";
        if (spec.Items) {
          const specObj = spec.Items[0];
          if (specObj) {
            specId = specObj.id;
          } else {
            specId = uuidv4();
            const specializationParams = {
              TableName: "Specialization",
              Item: {
                id: specId,
                specialization: requestBody.specialization,
              },
            };
            await dynamoDb.put(specializationParams).promise();
          }
        }
        const trainerParams = {
          TableName: "Trainer",
          Item: {
            id: uuidv4(),
            userId: userId,
            specializationId: specId,
          },
        };
        await Promise.all([
          dynamoDb.put(emailParams).promise(),
          dynamoDb.put(trainerParams).promise(),
        ]);
      }
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "User added successfully",
          username: userName,
          password: password,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to add user" }),
      };
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
