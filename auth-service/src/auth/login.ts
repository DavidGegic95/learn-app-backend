import { APIGatewayProxyResult } from "aws-lambda";
import jwt from "jsonwebtoken";
import { findUser, updateUser } from "./repository/loginRepo";
import { parseLoginBody } from "./utils/utils";

export const login = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const { email, password } = parseLoginBody(event);
    if (!email || !password) {
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
    //
    const user = await findUser(email);
    if (!user || (user.Items && user.Items.length === 0)) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: `User with email ${email} not found`,
        }),
      };
    }
    //
    const storedPassword = user.Items![0].password;
    if (password !== storedPassword) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Invalid password" }),
      };
    }
    //
    const updatedUser = await updateUser(user?.Items![0].id);
    if (!updatedUser) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Internal server error, unable to update active status",
        }),
      };
    }
    //
    const token = jwt.sign({ email: email }, "your_secret_key", {
      expiresIn: "1h",
    });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
