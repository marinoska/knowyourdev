import { Joi, Segments } from "celebrate";
import { Request, Response, RequestHandler } from "express";
import {
  GetProjectsListResponse,
} from "@kyd/common/api";
import { getProjects } from "@/models/project.repository.js";

// Define query params type locally to match the structure in common package
type GetProjectsListQueryParams = {
  page: number;
  limit: number;
};

export const getProjectsListController: RequestHandler<
  any,
  GetProjectsListResponse,
  any,
  GetProjectsListQueryParams
> = async (
  req: Request<any, GetProjectsListResponse, any, GetProjectsListQueryParams>,
  res: Response<GetProjectsListResponse>,
) => {
  const { page = 1, limit = 10 } = req.query;

  const { projects, totalRecords, totalPages, currentPage } = await getProjects({
    page: Number(page),
    limit: Number(limit),
  });

  const responseData = {
    projects: projects.map((project) => ({
      _id: project._id?.toString(),
      name: project.name,
      settings: project.settings,
      createdAt: project.createdAt?.toISOString(),
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
