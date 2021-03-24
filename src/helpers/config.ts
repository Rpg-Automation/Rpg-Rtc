import * as dotenv from "dotenv";
import path from "path";

import { Env, Domain } from "../types/Constants";

dotenv.config();

const config = {
	PORT: <number>parseInt(process.env.PORT) || 3000,
	CONNECTION_STRING: <string>process.env.CONNECTION_STRING || undefined,
	JWT_SECRET: <string>process.env.JWT_SECRET || undefined,
	ENV: <Env>process.env.NODE_ENV || Env.dev,
	IS_PROD: <boolean>(process.env.NODE_ENV == Env.prod) ? true : false,
	IS_COMPILED: <boolean>(path.extname(__filename).includes("js")) ? true : false,
	DOMAIN: <Domain>Domain.lcoal
};

export default config;