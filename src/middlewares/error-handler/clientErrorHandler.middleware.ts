import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const clientErrorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (req.xhr) {
		//Return an error without html
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			error: "Something failed!",
		});
	} else {
		next(err);
	}
};

export default clientErrorHandler;
