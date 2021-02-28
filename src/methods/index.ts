import { Socket } from "socket.io";
import { AxiosResponse } from "axios";

import Rest from "../services/rest";
import log from "../services/logger";
import * as T from "../types/Payloads";
import io from "../services/server";

// Generic socket wrapper
io.on("connection", (socket: Socket) => {
	log.info(`${new Date} ${socket.id} connected`);

	// allows the client to make a request, whilst obfisctaing
	// the endpoints and request data
	socket.on("request", async (request: T.IRequest) => {
		try {
			log.info(request);
			const response: AxiosResponse = await Rest.Get();
			socket.emit("response", { ok: true, status: 200, data: response } as T.IPaylaod);
		} catch (error) {
			log.error(error);
			socket.emit("error", { ok: false, status: 500, data: error } as T.IPaylaod);
		}
	});

	// handler on client disconnection
	socket.on("disconnect", () => {
		log.info(`${new Date} ${socket.id} disconnected`);
	});
});

export default io;