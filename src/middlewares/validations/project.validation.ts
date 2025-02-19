import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Joi from "joi";

import { Priority, Status } from "@/enum";
import { IProject } from "@/types/model.type";
import { customResponse } from "@/utils/customResponse.util";

const schemaValidate: Joi.ObjectSchema<IProject> = Joi.object({
	name: Joi.string().min(0).max(250).required(),
	description: Joi.string().max(2000).allow("").optional(),
	startDate: Joi.date().min(Date.now()).required(),
	endDate: Joi.date().min(Date.now()).required(),
	status: Joi.string()
		.valid(...Object.values(Status))
		.required(),
	priority: Joi.string()
		.valid(...Object.values(Priority))
		.required(),
});
export const partialSchemaValidate = schemaValidate.fork(
	Object.keys(schemaValidate.describe().keys),
	(schema) => schema.optional()
);
export const projectValidation = (
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
export const partialProjectValidation = (
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
