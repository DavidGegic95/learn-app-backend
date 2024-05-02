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

    // const params = {
    //   TableName: "Email",
    //   Key: {
    //     email: email,
    //   },
    // };
    // const data = await dynamoDb.get(params).promise();

    // if (!data.Item) {
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({ message: "User not found" }),
    //   };
    // }

    const params = {
      TableName: "User",
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    // const paramsUser = {
    //   TableName: "User",
    //   Key: {
    //     id: data.Item.id,
    //   },
    // };
    const user = await dynamoDb.scan(params).promise();
    if (user.Items && user.Items.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: `User with email ${email} not found`,
        }),
      };
    }
    const storedPassword = user.Items![0].password;

    if (password !== storedPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid password" }),
      };
    }
    const updateParams = {
      TableName: "User",
      Key: {
        id: user?.Items![0]?.id,
      },
      UpdateExpression: "SET #isActive = :isActive",
      ConditionExpression: "attribute_exists(email)",
      ExpressionAttributeNames: {
        "#isActive": "isActive",
      },
      ExpressionAttributeValues: {
        ":isActive": true,
      },
      ReturnValues: "ALL_NEW",
    };
    const updatedUser = await dynamoDb.update(updateParams).promise();

    const token = jwt.sign({ email: email }, "your_secret_key", {
      expiresIn: "1h",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        token: token,
        user: updatedUser.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error logging in:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
