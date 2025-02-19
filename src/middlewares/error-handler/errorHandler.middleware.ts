import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { customResponse } from "@/utils/customResponse.util";

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
		res.send(
			customResponse({
				message: ReasonPhrases.BAD_REQUEST,
				error: err.message,
				statusCode: StatusCodes.BAD_REQUEST,
			})
		);
	} catch (renderError) {
		console.error("Failed to render error page:", renderError);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			error: "Failed to render error page.",
		});
		const errorMessage =
			renderError instanceof Error
				? renderError.message
				: "Unknown error";
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
			customResponse({
				message: ReasonPhrases.BAD_REQUEST,
				error: errorMessage,
				statusCode: StatusCodes.BAD_REQUEST,
			})
		);
	}
};
