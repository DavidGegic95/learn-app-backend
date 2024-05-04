import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getTrainingsRepo = async () => {
  try {
    const params = {
      TableName: "Training",
    };

    const allTrainings = await dynamoDb.scan(params).promise();

    return allTrainings.Items;
  } catch (err) {
    console.error(err);
    return null;
  }
};
