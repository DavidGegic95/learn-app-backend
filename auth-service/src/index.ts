import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { login } from "./auth/login";
import { logout } from "./auth/logout";
import { register } from "./auth/register";

export const auth = async (event: any): Promise<APIGatewayProxyResult> => {
  const { action } = event.pathParameters || {};

  if (action === "login" && event.httpMethod === "POST") {
    return login(event);
  } else if (action === "logout" && event.httpMethod === "GET") {
    return logout(event);
  } else if (action === "register" && event.httpMethod === "POST") {
    return register(event);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Not Found" }),
  };
};
