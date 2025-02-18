import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import projectService from "@/services/project.service";
import { IProject } from "@/types/model.type";
import { customResponse } from "@/utils/customResponse.util";

const createProject = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const data = req.body;
		const result: IProject = await projectService.create(data);
		res.status(StatusCodes.CREATED).send(
			customResponse({
				statusCode: StatusCodes.CREATED,
				message: "Project created successfully",
				data: result,
			})
		);
	} catch (error) {
		next(error);
	}
};
const getAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result: IProject[] = await projectService.getAll(req.query);
		res.status(StatusCodes.OK).json({
			message: "Projects fetched successfully",
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
		const result: IProject | null = await projectService.getOneById(
			new mongoose.Types.ObjectId(id)
		);
		res.status(StatusCodes.OK).json(
			customResponse({
				message: "Project fetched successfully",
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
				error: "Project id is required",
			});
		}

		const result: IProject | null = await projectService.update(
			new mongoose.Types.ObjectId(id),
			req.body
		);
		res.status(StatusCodes.OK).json(
			customResponse({
				message: "Project updated successfully",
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
				error: "Project id is required",
			});
			return;
		}

		const result: IProject | null = await projectService.update(
			new mongoose.Types.ObjectId(id),
			req.body
		);
		res.status(StatusCodes.OK).json(
			customResponse({
				message: "Project updated successfully",
				statusCode: StatusCodes.OK,
				data: result,
			})
		);
	} catch (error) {
		next(error);
	}
};

export default { createProject, getOneById, update, getAll, updatePartial };
