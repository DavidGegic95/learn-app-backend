import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const getTrainingsByDate = async (date: string) => {
  try {
    let params = {
      TableName: "Training",
      FilterExpression: "#date = :date",
      ExpressionAttributeNames: {
        "#date": "date",
      },
      ExpressionAttributeValues: {
        ":date": date,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    return result.Items;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getTrainingsByName = async (name: string) => {
  try {
    let params = {
      TableName: "Training",
      FilterExpression: "#name = :name",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    return result.Items;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getTrainingsBySpecialization = async (specialization: string) => {
  try {
    let params = {
      TableName: "Training",
      FilterExpression: "#specialization = :specialization",
      ExpressionAttributeNames: {
        "#specialization": "specialization",
      },
      ExpressionAttributeValues: {
        ":specialization": specialization,
      },
    };

    const result = await dynamoDb.scan(params).promise();

    return result.Items;
  } catch (err) {
    console.error(err);
    return null;
  }
};
