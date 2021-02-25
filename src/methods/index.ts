import { Socket } from "socket.io";

import * as T from "../types/Payloads";
import io from "../services/server";

io.on("connection", (socket: Socket) => {
	console.log(`${new Date} ${socket.id} connected`);

	socket.on("test", (payload: T.ITest) => {
		console.log(payload);
	});
});

export default io;