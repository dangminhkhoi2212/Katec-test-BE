import mongoose, { PipelineStage, Types } from "mongoose";

import { LIMIT, PAGE } from "@/constants/service.contants";
import { Priority, Status } from "@/enum";
import { ProjectModel } from "@/models/project.model";
import { TaskModel } from "@/models/task.model";
import { ITask } from "@/types/model.type";
import { IQuery } from "@/types/service-query.type";

export interface ITaskQuery extends IQuery {
	assignedDate?: Date;
	dueDate?: Date;
	status?: Status;
	search?: string;
	priority?: Priority;
	project?: Types.ObjectId;
	isDeleted?: boolean;
}
const create = async (data: ITask): Promise<ITask> => {
	const project = await ProjectModel.findById(data.project);
	if (!project) throw new Error("Project not found");

	return await TaskModel.create(data);
};

const update = async (
	id: Types.ObjectId,
	data: ITask
): Promise<ITask | null> => {
	return await TaskModel.findByIdAndUpdate(id, data, { new: true }).lean();
};

const updatePartial = async (
	id: Types.ObjectId,
	data: Partial<ITask>
): Promise<ITask | null> => {
	return await TaskModel.findByIdAndUpdate(id, data, { new: true }).lean();
};

const getOneById = async (id: Types.ObjectId): Promise<ITask | null> => {
	return await TaskModel.findById(id);
};

const getAll = async (query: ITaskQuery): Promise<ITask[]> => {
	const aggregation: PipelineStage[] = [];
	const {
		assignedDate,
		dueDate,
		priority,
		status,
		project,
		search,
		isDeleted,
		limit = LIMIT,
		page = PAGE,
	} = query;
	console.log("🚀 ~ getAll ~ query:", query);

	const match: Record<string, any> = {};

	if (search) {
		aggregation.push({
			$search: {
				index: "task-search",
				text: {
					query: search.toString(),
					path: {
						wildcard: "*",
					},
					fuzzy: {},
				},
			},
		});
		aggregation.push({
			$addFields: { score: { $meta: "textScore" } },
		});
	}
	if (isDeleted) {
		typeof isDeleted === "string"
			? (match.isDeleted = isDeleted === "true")
			: (match.isDeleted = isDeleted);
	} else {
		match.isDeleted = false;
	}
	if (status) match.status = status;
	if (priority) match.priority = priority;
	if (project) match.project = new mongoose.Types.ObjectId(project);

	if (assignedDate && dueDate) {
		match.dueDate = {};
		const startOfDay = new Date(assignedDate);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(dueDate);
		endOfDay.setHours(23, 59, 59, 999);

		match.dueDate.$gte = startOfDay;
		match.dueDate.$lte = endOfDay;
	}

	if (Object.keys(match).length > 0) {
		aggregation.push({ $match: match });
	}

	// Sorting
	if (search) {
		aggregation.push({ $sort: { score: -1 } });
	} else {
		aggregation.push({ $sort: { assignedDate: 1 } });
	}

	// Pagination
	if (page && limit) {
		aggregation.push({ $skip: (page - 1) * limit });
		aggregation.push({ $limit: limit });
	}

	return await TaskModel.aggregate(aggregation);
};

export default { create, update, updatePartial, getOneById, getAll };
