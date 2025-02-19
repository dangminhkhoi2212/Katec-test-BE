import { Document, Schema } from "mongoose";

export interface IProject extends Document {
	name: string;
	description: string;
	startDate: Date;
	endDate: Date;
	status: string;
	priority: string;
	isDeleted: boolean;
	tasks: Schema.Types.ObjectId[];
}
export interface ITask extends Document {
	name: string;
	employee: string;
	description: string;
	dueDate: Date;
	status: string;
	assignedDate: Date;
	project: Schema.Types.ObjectId;
}
export interface IDocument extends Document {
	name: string;
	filePath: string;
	uploadDate: Date;
	uploadedBy: Schema.Types.ObjectId;
	project: Schema.Types.ObjectId;
	task: Schema.Types.ObjectId;
}
export interface IReminder extends Document {
	message: string;
	dueDate: Date;
	project: Schema.Types.ObjectId;
	task: Schema.Types.ObjectId;
}
export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	role: string;
}
