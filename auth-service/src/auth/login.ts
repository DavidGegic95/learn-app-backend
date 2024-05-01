import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const login = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    let email;
    let password;
    if (typeof event.body === "string") {
      const eventObj = JSON.parse(event.body) || "";
      email = eventObj.email;
      password = eventObj.password;
    } else if (
      event.body &&
      typeof event.body === "object" &&
      "password" in event.body &&
      "email" in event.body
    ) {
      email = event.body["email"];
      password = event.body["password"];
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Required request body, or corresponding paramaters missing",
        }),
      };
    }
    // Check if the user exists in DynamoDB
    const params = {
      TableName: "Users", // Change this to your DynamoDB table name
      Key: {
        email: email,
      },
    };
    const data = await dynamoDb.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // Perform password validation (example: using bcrypt)
    const storedPassword = data.Item.password; // Assuming you store the hashed password in DynamoDB
    // Example of password validation
    if (password !== storedPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid password" }),
      };
    }

    // Password is correct, generate JWT token
    const token = jwt.sign({ email: data.Item.email }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Return success with JWT token
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login successful", token: token }),
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
