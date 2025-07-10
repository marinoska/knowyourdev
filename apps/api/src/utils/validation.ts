import { Types } from "mongoose";

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param value The string to validate
 * @param helpers Joi validation helpers
 * @returns The original value if valid, or a Joi error if invalid
 */
export const validateObjectId = (value: string, helpers: any) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.error("string.objectId", { value });
  }
  return value;
};

/**
 * Validates if a string is a valid MongoDB ObjectId when present
 * @param value The string to validate (can be undefined or empty)
 * @param helpers Joi validation helpers
 * @returns The original value if valid or empty, or a Joi error if invalid
 */
export const validateOptionalObjectId = (value: string, helpers: any) => {
  if (value && !Types.ObjectId.isValid(value)) {
    return helpers.error("string.objectId", { value });
  }
  return value;
};