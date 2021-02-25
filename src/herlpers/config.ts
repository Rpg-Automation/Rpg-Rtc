import * as dotenv from "dotenv";

dotenv.config();

const config = {
	PORT: <number>parseInt(process.env.PORT) || 3000,
	CONNECTION_STRING: <string>process.env.CONNECTION_STRING || undefined,
	ENV: <string>process.env.NODE_ENV || "development",
	IS_PROD: <boolean>(process.env.NODE_ENV == "production") ? true : false,
	APPCODE: <string>process.env.APPCODE || undefined,
	APPTOKEN: <string>process.env.APPTOKEN || undefined,
	IS_COMPILED: <boolean>(process.env.NODE_ENV == "development" ? false : true),
};

export default config;