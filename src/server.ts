import cors from "cors";
import express, { Express, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import { mongo } from "@/config/db.config";
import { PORT } from "@/config/server.config";
import clientErrorHandler from "@/middlewares/error-handler/clientErrorHandler.middleware";
import { errorHandler } from "@/middlewares/error-handler/errorHandler.middleware";
import { logErrors } from "@/middlewares/error-handler/logErrors.middleware";
import projectRoute from "@/routes/project.route";
import taskRoute from "@/routes/task.route";
import swaggerDocJSON from "@/swagger/swagger-output.json";
import { clerkMiddleware } from "@clerk/express";

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app: Express = express();
const connectToDB = async () => {
	try {
		console.log("CONNECTING TO MONGODB.........");

		console.log(
			"🚀 ~ runServer ~ mongo.MONGO_CONNECTION:",
			mongo.MONGO_CONNECTION
		);
		await mongoose.connect(mongo.MONGO_CONNECTION);
		console.log("***************CONNECTED TO MONGODB***************");
	} catch (error) {
		console.log(
			"----------------ERROR CONNECTING TO MONGODB----------------"
		);
		console.log(error);
	}
};
const runServer = async (): Promise<void> => {
	// cors
	app.use(cors());

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	//connect to mongodb
	await connectToDB();
	//clerk
	app.use(clerkMiddleware());

	//swagger doc
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocJSON));
	//routes

	app.use("/api/projects", projectRoute);
	app.use("/api/tasks", taskRoute);
	app.get("/api/health-check", (req: Request, res: Response) => {
		res.status(StatusCodes.OK).send("This is a server!");
	});
	// log errors
	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);

	app.listen(PORT, () => {
		console.log(`[server]: Server is running at http://localhost:${PORT}`);
	});
};
runServer();
