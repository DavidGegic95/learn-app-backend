import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getTrainerById(id: string) {
  const params = {
    TableName: "Trainer",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": id,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    if (result.Items && result.Items[0]) {
      const trainer = result.Items[0];
      const specializatioObj = await getSpecializationById(
        trainer.specializationId
      );
      return {
        specialization: specializatioObj?.specialization,
      };
    }
  } catch (error) {
    console.error("Error scanning the table:", error);
    throw error;
  }
}

export async function getSpecializationById(id: string) {
  const params = {
    TableName: "Specialization",
    Key: {
      id: id,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error("Error getting the item:", error);
    throw error;
  }
}

export async function getStudentByUserId(id: string) {
  const params = {
    TableName: "Student",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": id,
    },
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    if (result.Items && result.Items[0]) {
      const student = result.Items[0];
      return {
        address: student.address,
        dateOfBirth: student.dateOfBirth,
        studentId: student.id,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error scanning the table:", error);
    throw error;
  }
}
