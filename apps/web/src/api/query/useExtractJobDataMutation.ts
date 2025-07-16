import { useMutation } from "@tanstack/react-query";
import { extractJobData } from "./api.ts";
import { ExtractJobDataRequestBody, ExtractJobDataResponse } from "@kyd/common/api";

export const useExtractJobDataMutation = () => {
  return useMutation<
    ExtractJobDataResponse,
    Error,
    ExtractJobDataRequestBody
  >({
    mutationFn: extractJobData,
    onError: (err) => {
      console.error("ExtractJobDataMutation error:", err.toString());
    },
  });
};