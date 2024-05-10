import { APIGatewayProxyResult } from "aws-lambda";
import { updateUserRepo } from "../repository/updateUserInfoRepo";

export const updateUserInfo = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "");
    if (
      !body ||
      !body.id ||
      !body.role ||
      !body.firstName ||
      !body.lastName ||
      !body.username
    ) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Required request body, or corresponding parameters missing",
        }),
      };
    }

    const updateUser = await updateUserRepo(body);

    if (!updateUser) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Failed to update user" }),
      };
    }
    delete updateUser.password;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Update successful",
        user: updateUser,
      }),
    };
  } catch (error) {
    console.error("Error updating info:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
