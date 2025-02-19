import { Router } from "express";

import {
	partialProjectValidation,
	projectValidation,
} from "@/middlewares/validations/project.validation";

import projectController from "../controllers/project.controller";

const router: Router = Router();
router
	.get("/:id", projectController.getOneById)
	.put("/:id", projectValidation, projectController.update)
	.patch("/:id", partialProjectValidation, projectController.updatePartial);
router
	.get("/", projectController.getAll)
	.post("/", projectValidation, projectController.createProject);

export default router;
