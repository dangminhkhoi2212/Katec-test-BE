import { model, Schema } from "mongoose";

import { Priority, Status } from "@/enum";
import { IProject } from "@/types/model.type";

const ProjectSchema = new Schema<IProject>(
	{
		name: { type: String, required: true },
		description: { type: String },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		status: {
			type: String,
			required: true,
			enum: Status,
			default: Status.NEW,
		},
		priority: {
			type: String,
			required: true,
			enum: Priority,
			default: Priority.MEDIUM,
		},
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const ProjectModel = model<IProject>("Project", ProjectSchema);
