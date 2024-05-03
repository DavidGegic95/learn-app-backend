import { APIGatewayProxyResult } from "aws-lambda";
import { parseBodyDeleteUser } from "./utils";
import { deleteUserRepo } from "../repository/deleteUserRepo";

export const deleteUser = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  try {
    const id = parseBodyDeleteUser(event);

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

    const deletedUser = await deleteUserRepo(id);

    if (!deletedUser) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Cannot find or delete user",
        }),
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "User deleted successfully",
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
