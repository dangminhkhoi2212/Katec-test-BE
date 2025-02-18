import { Router } from "express";

import { projectValidation } from "@/middlewares/validations/project.validation";

import projectController from "../controllers/project.controller";

const router: Router = Router();
router
	.get("/:id", projectController.getOneById)
	.put("/:id", projectController.update)
	.patch("/:id", projectController.updatePartial);
router
	.get("/", projectController.getAll)
	.post("/", projectValidation, projectController.createProject);

export default router;
