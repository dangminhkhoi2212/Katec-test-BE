import { model, Schema } from 'mongoose';

import { Priority, Status } from '@/enum';
import { ITask } from '@/types/model.type';

const TaskSchema = new Schema<ITask>(
	{
		name: { type: String, required: true },
		employee: { type: String, required: true },
		description: { type: String, maxlength: 2000 },
		dueDate: { type: Date, required: true },
		assignedDate: { type: Date, required: true },
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
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},
		isDeleted: { type: Boolean, default: false, required: true },
	},
	{ timestamps: true }
);

export const TaskModel = model<ITask>("Task", TaskSchema);
