import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUser } from "./user/getUser";
import { deleteUser } from "./user/deleteUser";
import { updatePhoto } from "./user/updatePhoto";
import { updatePassword } from "./user/updatePassword";

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const { action } = event.pathParameters || {};

  if (action === "me" && event.httpMethod === "GET") {
    // return getUser(event);
  } else if (action === "me" && event.httpMethod === "DELETE") {
    // return deleteUser(event);
  } else if (action === "upload-photo" && event.httpMethod === "POST") {
    // return updatePhoto(event);
  } else if (action === "update-password" && event.httpMethod === "PUT") {
    return updatePassword(event);
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Not Found" }),
  };
};
