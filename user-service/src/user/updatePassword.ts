import { APIGatewayProxyResult } from "aws-lambda";
import {
  checkUser,
  updatePasswordRepo,
} from "../repository/updatePasswordRepo";
import { parseBody } from "./utils";

export const updatePassword = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  try {
    const body = parseBody(event);
    if (!body || !body.id || !body.password || !body.newPassword) {
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
    const user = await checkUser(body.id);
    if (!user || !user.password) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "User or password not found" }),
      };
    }

    if (user.password !== body.password) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Please enter valid password.",
        }),
      };
    }
    if (user.password === body.newPassword) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Please enter new password, old and new password are same.",
        }),
      };
    }
    const updateUser = await updatePasswordRepo(body.id, body.newPassword);
    if (!updateUser) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "54 line" }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "update password",
        user: updateUser,
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
