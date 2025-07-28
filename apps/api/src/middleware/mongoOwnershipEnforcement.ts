import { Query, Schema } from "mongoose";

function enforceOwnership(this: Query<unknown, unknown>) {
  const userId = this.getOptions().userId;
  if (userId) {
    this.where({ userId });
  } else {
    const modelName = this.model.modelName;
    const operation = (this as any).op as string | undefined;
    throw new Error(`User ID is missing on ${modelName}.${operation}`);
  }
}

const methodsToEnforce = [
  "find",
  "findOne",
  "findOneAndUpdate",
  "findOneAndDelete",
  "findOneAndRemove",
  "findOneAndReplace",
  "updateOne",
  "updateMany",
  "deleteOne",
  "deleteMany",
  "countDocuments",
  "replaceOne",
] as const;

export function applyOwnershipEnforcement(schema: Schema<any, any, any, any>) {
  methodsToEnforce.forEach((method) => {
    schema.pre(method as Parameters<Schema["pre"]>[0], enforceOwnership);
  });
}
