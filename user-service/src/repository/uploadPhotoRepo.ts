import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const uploadPhotoRepo = async (id: string, photoUrl: string) => {
  try {
    const updateParams = {
      TableName: "User",
      Key: {
        id: id,
      },
      UpdateExpression: "SET #photo = :photo",
      ConditionExpression: "attribute_exists(id)",
      ExpressionAttributeNames: {
        "#photo": "photo",
      },
      ExpressionAttributeValues: {
        ":photo": photoUrl,
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
