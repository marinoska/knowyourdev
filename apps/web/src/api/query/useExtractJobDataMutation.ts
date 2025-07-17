import { useMutation } from "@tanstack/react-query";
import { extractJobData } from "./api.ts";
import {
  ExtractProjectDataRequestBody,
  ExtractProjectDataResponse,
} from "@kyd/common/api";

export const useExtractJobDataMutation = () => {
  return useMutation<
    ExtractProjectDataResponse,
    Error,
    ExtractProjectDataRequestBody
  >({
    mutationFn: extractJobData,
    onError: (err) => {
      console.error("ExtractJobDataMutation error:", err.toString());
    },
  });
};
