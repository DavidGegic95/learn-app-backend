import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { RequestBody } from "../utils/utils";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const putTrainer = async (userId: string, specId: string) => {
  try {
    const trainerParams = {
      TableName: "Trainer",
      Item: {
        id: uuidv4(),
        userId: userId,
        specializationId: specId,
      },
    };
    await dynamoDb.put(trainerParams).promise();
  } catch (err) {
    throw err;
  }
};

export const registerUser = async (
  userId: string,
  userName: string,
  password: string,
  requestBody: RequestBody
) => {
  const params = {
    TableName: "User",
    Item: {
      id: userId,
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      email: requestBody.email,
      isActive: false,
      username: userName,
      photo: "",
      password: password,
    },
  };
  const studentParams = {
    TableName: "Student",
    Item: {
      id: uuidv4(),
      userId: userId,
      dateOfBirth: requestBody.dateOfBirth || "",
      address: requestBody.address || "",
    },
  };

  const specializationParams = {
    TableName: "Specialization",
    FilterExpression: "specialization = :specialization",
    ExpressionAttributeValues: {
      ":specialization": requestBody.specialization,
    },
  };

  try {
    let specId = "";
    const user = await dynamoDb.put(params).promise();
    if (requestBody.role === "student") {
      await dynamoDb.put(studentParams).promise();
    } else {
      const spec = await dynamoDb.scan(specializationParams).promise();
      if (spec.Items && spec.Items[0]) {
        const specObj = spec.Items[0].id;
      } else {
        specId = uuidv4();
        const createSpecializationParams = {
          TableName: "Specialization",
          Item: {
            id: specId,
            specialization: requestBody.specialization,
          },
        };
        await dynamoDb.put(createSpecializationParams).promise();
      }
    }

    await putTrainer(userId, specId);

    return user;
  } catch (error) {
    return null;
  }
};

export const checkEmail = async (email: string) => {
  const emailParams = {
    TableName: "User",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  try {
    const user = await dynamoDb.scan(emailParams).promise();

    console.log("useer", user);
    if (user.Items && user.Items[0]) {
      return null;
    } else {
      return user;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
