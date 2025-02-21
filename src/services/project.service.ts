import { PipelineStage, Types } from "mongoose";

import { LIMIT, PAGE } from "@/constants/service.contants";
import { Priority, Status } from "@/enum";
import { ProjectModel } from "@/models/project.model";
import { IProject } from "@/types/model.type";
import { IQuery } from "@/types/service-query.type";

type TSort =
	| "startDate.asc"
	| "startDate.desc"
	| "endDate.asc"
	| "endDate.desc";
export interface IProjectQuery extends IQuery {
	startDate?: Date;
	endDate?: Date;
	status?: Status;
	priority?: Priority;
	search?: string;
	sort?: TSort;
}
const sortMap: Record<TSort, Record<string, 1 | -1>> = {
	"startDate.asc": { startDate: 1 },
	"startDate.desc": { startDate: -1 },
	"endDate.asc": { endDate: 1 },
	"endDate.desc": { endDate: -1 },
};
const create = async (data: IProject): Promise<IProject> => {
	return await ProjectModel.create(data);
};

const update = async (
	id: Types.ObjectId,
	data: IProject
): Promise<IProject | null> => {
	return await ProjectModel.findByIdAndUpdate(id, data, { new: true }).lean();
};

const updatePartial = async (
	id: Types.ObjectId,
	data: Partial<IProject>
): Promise<IProject | null> => {
	return await ProjectModel.findByIdAndUpdate(id, data, { new: true });
};

const getOneById = async (id: Types.ObjectId): Promise<IProject | null> => {
	return await ProjectModel.findById(id);
};

const getAll = async (query: IProjectQuery): Promise<IProject[]> => {
	const aggregation: PipelineStage[] = [];
	const {
		priority,
		status,
		isDeleted,
		search,
		sort,
		limit = LIMIT,
		page = PAGE,
	} = query;
	console.log("🚀 ~ getAll ~ query:", query);
	const match: Record<string, any> = {};

	if (search) {
		aggregation.push({
			$search: {
				index: "search-projects",
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

	if (Object.keys(match).length > 0) {
		aggregation.push({ $match: match });
	}
	if (search) {
		aggregation.push({ $sort: { score: -1 } });
	} else {
		aggregation.push({ $sort: sort ? sortMap[sort] : { startDate: 1 } });
	}

	if (limit) aggregation.push({ $limit: limit });
	if (page) aggregation.push({ $skip: (page - 1) * limit });
	return await ProjectModel.aggregate(aggregation);
};
export default { create, update, updatePartial, getOneById, getAll };
