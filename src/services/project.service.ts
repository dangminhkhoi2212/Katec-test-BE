import { PipelineStage, Types } from 'mongoose';

import { LIMIT, PAGE } from '@/constants/service.contants';
import { Priority, Status } from '@/enum';
import { ProjectModel } from '@/models/project.model';
import { IProject } from '@/types/model.type';
import { IQuery } from '@/types/service-query.type';

export interface IProjectQuery extends IQuery {
	startDate?: Date;
	endDate?: Date;
	status?: Status;
	priority?: Priority;
}
const create = async (data: IProject): Promise<IProject> => {
	return await ProjectModel.create(data);
};

const update = async (
	id: Types.ObjectId,
	data: IProject
): Promise<IProject | null> => {
	return await ProjectModel.findByIdAndUpdate(id, data).lean();
};

const updatePartial = async (
	id: Types.ObjectId,
	data: Partial<IProject>
): Promise<IProject | null> => {
	return await ProjectModel.findByIdAndUpdate(id, data);
};

const getOneById = async (id: Types.ObjectId): Promise<IProject | null> => {
	return await ProjectModel.findById(id);
};

const getAll = async (query: IProjectQuery): Promise<IProject[]> => {
	const aggregation: PipelineStage[] = [];
	const {
		startDate,
		endDate,
		priority,
		status,
		limit = LIMIT,
		page = PAGE,
	} = query;
	console.log("🚀 ~ getAll ~ query:", query);
	const match: Record<string, any> = {};

	if (status) match.status = status;
	if (priority) match.priority = priority;
	if (startDate || endDate) {
		match.startDate = {};
		if (startDate) match.startDate.$gte = new Date(startDate);
		if (endDate) match.startDate.$lte = new Date(endDate);
	}

	if (Object.keys(match).length > 0) {
		aggregation.push({ $match: match });
	}
	if (limit) aggregation.push({ $limit: limit });
	if (page) aggregation.push({ $skip: (page - 1) * limit });
	return await ProjectModel.aggregate(aggregation);
};
export default { create, update, updatePartial, getOneById, getAll };
