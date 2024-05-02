import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const findUser = async (email: string) => {
  try {
    const params = {
      TableName: "User",
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };
    const user = await dynamoDb.scan(params).promise();
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateUser = async (id: string) => {
  try {
    const updateParams = {
      TableName: "User",
      Key: {
        id: id,
      },
      UpdateExpression: "SET #isActive = :isActive",
      ConditionExpression: "attribute_exists(email)",
      ExpressionAttributeNames: {
        "#isActive": "isActive",
      },
      ExpressionAttributeValues: {
        ":isActive": true,
      },
      ReturnValues: "ALL_NEW",
    };
    const updatedUser = await dynamoDb.update(updateParams).promise();
    return updatedUser;
  } catch (err) {
    console.log(err);
    return null;
  }
};
