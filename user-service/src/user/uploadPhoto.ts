import { APIGatewayProxyResult } from "aws-lambda";
import { checkUser } from "../repository/updatePasswordRepo";
import { parseBodyUpdatePhoto } from "./utils";
import { uploadPhotoRepo } from "../repository/uploadPhotoRepo";

export const uploadPhoto = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  try {
    const body = parseBodyUpdatePhoto(event);
    if (!body || !body.id || !body.photoUrl) {
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
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const updateUser = await uploadPhotoRepo(body.id, body.photoUrl);
    if (!updateUser) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Falied to update photo" }),
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
