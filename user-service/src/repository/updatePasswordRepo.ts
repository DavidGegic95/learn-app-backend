import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getUserRepo = async (id: string) => {
  try {
    const getUserParams = {
      TableName: "User",
      Key: {
        id: id,
      },
    };
    const user = await dynamoDb.get(getUserParams).promise();

    return user.Item;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updatePasswordRepo = async (id: string, newPassword: string) => {
  try {
    const updateParams = {
      TableName: "User",
      Key: {
        id: id,
      },
      UpdateExpression: "SET #password = :password",
      ConditionExpression: "attribute_exists(id)",
      ExpressionAttributeNames: {
        "#password": "password",
      },
      ExpressionAttributeValues: {
        ":password": newPassword,
      },
      ReturnValues: "ALL_NEW",
    };
    const updatedUser = await dynamoDb.update(updateParams).promise();
    return updatedUser?.Attributes;
  } catch (err) {
    console.log(err);
    return null;
  }
};
