import { Router } from "express";

import taskController from "@/controllers/task.controller";
import {
	partialTaskValidation,
	taskValidation,
} from "@/middlewares/validations/task.validation";

const router: Router = Router();
router
	.get("/:id", taskController.getOneById)
	.put("/:id", taskValidation, taskController.update)
	.patch("/:id", partialTaskValidation, taskController.updatePartial);
router
	.get("/", taskController.getAll)
	.post("/", taskValidation, taskController.create);

export default router;
