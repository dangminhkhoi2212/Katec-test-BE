import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!err) {
			throw new Error("An unknown error occurred.");
		}
		res.status(StatusCodes.INTERNAL_SERVER_ERROR);
		res.send({ error: err.message || "An error occurred." });
	} catch (renderError) {
		console.error("Failed to render error page:", renderError);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			error: "Failed to render error page.",
		});
	}
};
