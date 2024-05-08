import { APIGatewayProxyResult } from "aws-lambda";
import { getUserRepo } from "../repository/updatePasswordRepo";
import { getStudentByUserId, getTrainerById } from "../repository/getUserRepo";

export const getUser = async (event: any): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.queryStringParameters?.id;
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
    const user = await getUserRepo(id);
    if (!user) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    let additionalInfo = {};
    if (user.role === "trainer") {
      const trainerInfo = await getTrainerById(id);
      additionalInfo = { ...trainerInfo };
    } else {
      const studentInfo = await getStudentByUserId(id);
      additionalInfo = { ...studentInfo };
    }
    delete user.password;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Get user",
        data: { ...user, ...additionalInfo },
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
