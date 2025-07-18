import { CategoryType, ScopeType, TechCode, TrendType } from "./constants.js";
import { Schema } from "mongoose";

export type TechCodeType = string;
export type TTechnology<
  TId extends string | Schema.Types.ObjectId = Schema.Types.ObjectId,
> = {
  _id: TId;
  name: string;
  code: TechCodeType;
  usage2024?: number;
  usage2016?: number;
  trend: TrendType;
  category: CategoryType;
  scope: ScopeType;
};

export type TechStack = {
  stackName: string;
  matchedComponents: TechCode[];
  matchPercentage: number;
};
