import { model, Schema } from 'mongoose';

import { IUser } from '@/types/model.type';

const UserSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true },
		role: { type: String, required: true },
	},
	{ timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
