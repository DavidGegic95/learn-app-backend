import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { login } from "./auth/login";

export const auth = async (event: any): Promise<APIGatewayProxyResult> => {
  const { action } = event.pathParameters || {};


  if (action === "login") {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }
    return login(event);
  } else if (action === "logout") {
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }
    // return logout(event);
  } else if (action === "register") {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }
    // return register(event);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Not Found" }),
  };
};
