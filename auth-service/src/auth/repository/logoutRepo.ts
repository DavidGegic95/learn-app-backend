import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const logoutUserRepo = async (id: string) => {
  const params = {
    TableName: "User",
    Key: {
      id: id,
    },
    UpdateExpression: "SET #isActive = :isActive",
    ConditionExpression: "attribute_exists(id)",
    ExpressionAttributeNames: {
      "#isActive": "isActive",
    },
    ExpressionAttributeValues: {
      ":isActive": false,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    return await dynamoDb.update(params).promise();
  } catch (error: any) {
    if (error.code === "ConditionalCheckFailedException") {
      return null;
    }
    throw error;
  }
};
