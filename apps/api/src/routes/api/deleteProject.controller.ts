import { RequestHandler } from "express";
import { Joi, Segments } from "celebrate";
import { ProjectModel } from "@/models/project.model.js";

export type DeleteProjectController = RequestHandler<
  { projectId: string },
  { success: boolean },
  unknown,
  unknown
>;

export const deleteProjectController: DeleteProjectController = async (
  req,
  res,
) => {
  const { projectId } = req.params;

  try {
    const success = await ProjectModel.deleteById(projectId);

    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error("Failed to delete project:", error);
    res.status(500).json({ success: false });
  }
};

export const deleteProjectValidationSchema = {
  [Segments.PARAMS]: Joi.object({
    projectId: Joi.string().required(),
  }),
};
