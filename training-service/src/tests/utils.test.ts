import {
  hasRequiredProperties,
  Training,
  parseBodyReturnTrainingObj,
} from "../utils";

describe("hasRequiredProperties", () => {
  it("should return false if obj is not an object", () => {
    const obj = {};
    const result = hasRequiredProperties(obj as Training, ["id", "name"]);
    expect(result).toBe(false);
  });

  it("should return false if obj does not have required properties", () => {
    const obj = {
      id: "1",
      studentId: "1",
      trainerId: "1",
      date: "2024-01-01",
      duration: 60,
      description: "Description",
    };
    const result = hasRequiredProperties(obj as Training, ["id", "name"]);
    expect(result).toBe(false);
  });

  it("should return false if obj has required properties but their values are falsy", () => {
    const obj = {
      id: "1",
      studentId: "1",
      trainerId: "1",
      name: "",
      date: "2024-01-01",
      duration: 60,
      description: "Description",
    };
    const result = hasRequiredProperties(obj as Training, ["id", "name"]);
    expect(result).toBe(false);
  });

  it("should return true if obj has all required properties with truthy values", () => {
    const obj: Training = {
      id: "1",
      studentId: "1",
      trainerId: "1",
      name: "Training 1",
      type: {
        id: "string",
        trainingType: "string",
      },
      date: "2024-01-01",
      duration: 60,
      description: "Description",
    };
    const result = hasRequiredProperties(obj, ["id", "name"]);
    expect(result).toBe(true);
  });

  it("should return true if obj has all required properties and additional properties", () => {
    const obj: Training = {
      id: "1",
      studentId: "1",
      trainerId: "1",
      name: "Training 1",
      type: { id: "1", trainingType: "Type" },
      date: "2024-01-01",
      duration: 60,
      description: "Description",
    };
    const result = hasRequiredProperties(obj, [
      "id",
      "name",
      "date",
      "duration",
      "description",
    ]);
    expect(result).toBe(true);
  });
});

const requiredPropsBody = [
  "id",
  "studentId",
  "trainerId",
  "name",
  "type",
  "date",
  "duration",
  "description",
];

describe("parseBodyReturnTrainingObj", () => {
  it("should return null if event body is not a string or object", () => {
    const event = { body: 123 };
    const result = parseBodyReturnTrainingObj(event);
    expect(result).toBeNull();
  });

  it("should return null if event body is an object but does not have all required properties", () => {
    const event = { body: { id: "1", studentId: "1" } };
    const result = parseBodyReturnTrainingObj(event);
    expect(result).toBeNull();
  });

  it("should return parsed object if event body is a valid stringified object", () => {
    const event = {
      body: '{"id": "1", "studentId": "1", "trainerId": "1", "name": "Training 1", "type": { "id": "1", "trainingType": "Type" }, "date": "2024-01-01", "duration": 60, "description": "Description" }',
    };
    const result = parseBodyReturnTrainingObj(event);
    const expected: Training = {
      id: "1",
      studentId: "1",
      trainerId: "1",
      name: "Training 1",
      type: { id: "1", trainingType: "Type" },
      date: "2024-01-01",
      duration: 60,
      description: "Description",
    };
    expect(result).toEqual(expected);
  });
});
