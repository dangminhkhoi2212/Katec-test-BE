// Swagger setup
export const swaggerOptions = {
	swaggerDefinition: {
		myapi: "3.0.0",
		info: {
			title: "Kactec test API",
			version: "1.0.0",
			description: "API documentation",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["./src/index.ts"], // files containing annotations as above
};
