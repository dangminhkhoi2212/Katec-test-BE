import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Joi from "joi";
import mongoose from "mongoose";

import { Priority, Status } from "@/enum";
import { ITask } from "@/types/model.type";
import { customResponse } from "@/utils/customResponse.util";

const isObjectId = Joi.string().custom((value, helpers) => {
	if (!mongoose.Types.ObjectId.isValid(value)) {
		return helpers.message({
			custom: `"${helpers.state.path}" must be a valid ObjectId`,
		});
	}
	return value;
}, "ObjectId Validation");
const schemaValidate: Joi.ObjectSchema<ITask> = Joi.object<ITask>({
	name: Joi.string().min(0).max(250).required(),
	description: Joi.string().max(2000).allow("").optional(),
	assignedDate: Joi.date().min(new Date().setHours(0, 0, 0, 0)).required(),
	dueDate: Joi.date().min(new Date().setHours(0, 0, 0, 0)).required(),
	employee: Joi.string().max(30).required(),
	project: isObjectId.required(),
	status: Joi.string()
		.valid(...Object.values(Status))
		.required(),
	priority: Joi.string()
		.valid(...Object.values(Priority))
		.required(),
	isDeleted: Joi.boolean().default(false),
});
const partialSchemaValidate = schemaValidate.fork(
	Object.keys(schemaValidate.describe().keys),
	(schema) => schema.optional()
);
export const taskValidation = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { error } = schemaValidate.validate(req.body);
	if (error) {
		res.status(StatusCodes.BAD_REQUEST).json(
			customResponse({
				message: ReasonPhrases.BAD_REQUEST,
				error: error.message,
				statusCode: StatusCodes.BAD_REQUEST,
			})
		);
		return;
	}
	next();
};
export const partialTaskValidation = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { error } = partialSchemaValidate.validate(req.body);
	if (error) {
		res.status(StatusCodes.BAD_REQUEST).json(
			customResponse({
				message: ReasonPhrases.BAD_REQUEST,
				error: error.message,
				statusCode: StatusCodes.BAD_REQUEST,
			})
		);
		return;
	}
	next();
};
