import dotenv from 'dotenv';

dotenv.config();

export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
export const MONGO_QUERY = process.env.MONGO_QUERY || "";
export const MONGO_CLUSTER = process.env.MONGO_CLUSTER || "";
export const MONGO_CONNECTION = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}`;
export const mongo = {
	MONGO_USER,
	MONGO_PASSWORD,
	MONGO_QUERY,
	MONGO_CONNECTION,
};
