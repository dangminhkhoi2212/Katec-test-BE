import { model, Schema } from "mongoose";

import { Status } from "@/enum";
import { ITask } from "@/types/model.type";

const TaskSchema = new Schema<ITask>(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		dueDate: { type: Date, required: true },
		assignedDate: { type: Date, required: true },
		status: {
			type: String,
			required: true,
			enum: Status,
			default: Status.NEW,
		},
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
	},
	{ timestamps: true }
);

export const Task = model<ITask>("Task", TaskSchema);
