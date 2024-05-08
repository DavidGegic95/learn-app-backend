import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface BaseUser {
  isActive: boolean;
  role: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
}

export interface StudentUser extends BaseUser {
  address: string;
  dateOfBirth: string;
}

export type UserDataType = StudentUser | BaseUser;

export const updateUserRepo = async (body: UserDataType) => {
  try {
    const updateParams = {
      TableName: "User",
      Key: {
        id: body.id,
      },
      UpdateExpression:
        "SET #firstName = :firstName, #lastName = :lastName, #username = :username, #isActive = :isActive",
      ConditionExpression: "attribute_exists(id)",
      ExpressionAttributeNames: {
        "#firstName": "firstName",
        "#lastName": "lastName",
        "#username": "username",
        "#isActive": "isActive",
      },
      ExpressionAttributeValues: {
        ":firstName": body.firstName,
        ":lastName": body.lastName,
        ":username": body.username,
        ":isActive": body.isActive,
      },
      ReturnValues: "ALL_NEW",
    };
    const updatedUser = await dynamoDb.update(updateParams).promise();

    if (
      updatedUser?.Attributes &&
      updatedUser.Attributes.role === "student" &&
      "address" in body
    ) {
      const updatedStudent = await updateStudentInfoByUserId(
        body.id,
        body.address,
        body.dateOfBirth
      );
      return updatedStudent;
    } else {
      return updatedUser?.Attributes;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function updateStudentInfoByUserId(
  userId: string,
  address: string,
  dateOfBirth: string
) {
  const params = {
    TableName: "Student",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    if (result.Items && result.Items[0]) {
      const student = result.Items[0];
      const updateParams = {
        TableName: "Student",
        Key: {
          id: student.id,
          userId: student.userId,
        },
        UpdateExpression:
          "SET #address = :address, #dateOfBirth = :dateOfBirth",
        ConditionExpression: "attribute_exists(id)",
        ExpressionAttributeNames: {
          "#address": "address",
          "#dateOfBirth": "dateOfBirth",
        },
        ExpressionAttributeValues: {
          ":address": address,
          ":dateOfBirth": dateOfBirth,
        },
        ReturnValues: "ALL_NEW",
      };
      const updatedStudent = await dynamoDb.update(updateParams).promise();
      return updatedStudent?.Attributes;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error scanning the table:", error);
    throw error;
  }
}
