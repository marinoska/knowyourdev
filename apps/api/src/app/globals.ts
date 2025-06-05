import { TechListModel } from "@/models/techList.model.js";
import { connected } from "./mongo.js";
import logger from "@/app/logger.js";
import { CategoryType } from "@kyd/common/api";

const log = logger("Globals");

class Globals {
  private static instance: Globals;
  maxUsage: Record<CategoryType, number> | undefined;

  private constructor() {}

  async init() {
    await connected;
    Globals.instance.maxUsage = await TechListModel.getMaxPopularity();

    log.info("Globals initialized 🙌");
    log.info(`maxUsage: ${JSON.stringify(Globals.instance.maxUsage)}`);
  }

  static getInstance(): Globals {
    if (!Globals.instance) {
      Globals.instance = new Globals();
    }
    return Globals.instance;
  }
}

export const globals = Globals.getInstance();
