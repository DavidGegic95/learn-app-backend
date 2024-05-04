import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const deleteUserRepo = async (id: string) => {
  try {
    const deleteParams = {
      TableName: "User",
      Key: {
        id: id,
      },
      ConditionExpression: "attribute_exists(id)",
      ReturnValues: "ALL_OLD",
    };
    const deletedUser = await dynamoDb.delete(deleteParams).promise();
    return deletedUser.Attributes;
  } catch (err) {
    console.log(err);
    return null;
  }
};
