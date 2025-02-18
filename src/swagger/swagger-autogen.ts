const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
	info: {
		version: "1.0.0", // by default: '1.0.0'
		title: "Katec-test", // by default: 'REST API'
		description: "API documentation", // by default: ''
	},
	host: "localhost:5000", // by default: 'localhost:3000'
	basePath: "/",
	schemes: ["http"],
	consumes: ["application/json"],
	produces: ["application/json"],
	tags: [
		// by default: empty Array
		{
			name: "Project", // Tag name
			description: "API project", // Tag description
		},
		// { ... }
	],
	securityDefinitions: {}, // by default: empty object
	definitions: {}, // by default: empty object
};

const outputFile = "./swagger-output.json";
const routes = ["src/index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
