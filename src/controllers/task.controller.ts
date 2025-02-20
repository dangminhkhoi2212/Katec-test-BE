import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import taskService from "@/services/task.service";
import { ITask } from "@/types/model.type";
import { customResponse } from "@/utils/customResponse.util";

const create = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data: ITask = req.body as ITask;
		const result: ITask = await taskService.create(data);
		res.status(StatusCodes.CREATED).send(
			customResponse({
				statusCode: StatusCodes.CREATED,
				message: "Task created successfully",
				data: result,
			})
		);
	} catch (error) {
		next(error);
	}
};
const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result: ITask[] = await taskService.getAll(req.query);
		res.status(StatusCodes.OK).json({
			message: "Tasks fetched successfully",
			status: ReasonPhrases.OK,
			data: result,
		});
	} catch (error) {
		next(error);
	}
};
const getOneById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;
		if (!id) {
			return;
		}
		const result: ITask | null = await taskService.getOneById(
			new mongoose.Types.ObjectId(id)
		);
		res.status(StatusCodes.OK).json(
			customResponse({
				message: "Task fetched successfully",
				statusCode: StatusCodes.OK,
				data: result,
			})
		);
	} catch (error) {
		next(error);
	}
};

const update = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;
		if (!id) {
			res.status(StatusCodes.BAD_REQUEST).send({
				error: "Task id is required",
			});
		}

		const result: ITask | null = await taskService.update(
			new mongoose.Types.ObjectId(id),
			req.body
		);
		res.status(StatusCodes.OK).json(
			customResponse({
				message: "Task updated successfully",
				statusCode: StatusCodes.OK,
				data: result,
			})
		);
	} catch (error) {
		next(error);
	}
};
const updatePartial = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id;
		if (!id) {
			res.status(StatusCodes.BAD_REQUEST).send({
				error: "Task id is required",
			});
			return;
		}

		const result: ITask | null = await taskService.updatePartial(
			new mongoose.Types.ObjectId(id),
			req.body
		);
		res.status(StatusCodes.OK).json(
			customResponse({
				message: "Task updated successfully",
				statusCode: StatusCodes.OK,
				data: result,
			})
		);
	} catch (error) {
		next(error);
	}
};

export default { create, getOneById, update, getAll, updatePartial };
