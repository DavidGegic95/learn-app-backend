import AWS from "aws-sdk";
import { Training } from "../utils";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const createTrainingRepo = async (trainingObj: Training) => {
  try {
    const trainerParams = {
      TableName: "Training",
      Item: trainingObj,
    };
    const createdTraining = await dynamoDb.put(trainerParams).promise();
    return createdTraining;
  } catch (err) {
    console.log(err);
    return null;
  }
};
