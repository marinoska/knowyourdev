import { Joi, Segments } from "celebrate";
import { Request, Response, RequestHandler } from "express";
import {
  GetProjectsPageQueryParams,
  TListResponse,
  TProjectPopulated,
} from "@kyd/common/api";
import { ProjectModel } from "@/models/project.model.js";

type GetProjectsListResponse = TListResponse<{
  projects: TProjectPopulated[];
}>;

export const getProjectsListController: RequestHandler<
  unknown,
  GetProjectsListResponse,
  unknown,
  GetProjectsPageQueryParams
> = async (
  req: Request<
    unknown,
    GetProjectsListResponse,
    unknown,
    GetProjectsPageQueryParams
  >,
  res: Response<GetProjectsListResponse>,
) => {
  const { page = 1, limit = 10 } = req.query;

  const { projects, totalRecords, totalPages, currentPage } =
    await ProjectModel.getPage({
      page: Number(page),
      limit: Number(limit),
    });

  const responseData = {
    projects: projects.map((project) => ({
      ...project,
      candidates: project.candidates || [], // Ensure candidates field is included
    })),
    totalRecords,
    currentPage,
    totalPages,
  };

  res.status(200).json(responseData);
};

export const getProjectsListValidationSchema = {
  [Segments.QUERY]: {
    page: Joi.number().integer().min(1).default(1).optional(), // Page number
    limit: Joi.number().integer().min(1).default(30).optional(), // Page size
  },
};
