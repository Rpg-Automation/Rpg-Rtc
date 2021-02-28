import { Socket } from "socket.io";
import { AxiosResponse } from "axios";

import * as T from "../types/Payloads";
import Rest from "../services/rest";
import io from "../services/server";
import log from "../services/logger";

export default class WebSocket {

	private static connections: T.IClient[] = [];

	public static Respond(socket: Socket, payload: T.IPaylaod): void {
		socket.emit("response", { ok: payload.ok, status: payload.status, data: payload.data });
	}

	public static Connect(socket: Socket): void {
		try {
			WebSocket.connections.push({ id: socket.id, connected: new Date() });
			// prob remove later
			log.info(`${new Date} ${socket.id} connected`);
			console.log(WebSocket.connections);
		} catch (error) {
			log.error(error);
		}
	}

	public static Disconnect(socket: Socket): void {
		try {
			WebSocket.connections = WebSocket.connections.filter(a => a.id !== socket.id);
			// prob remove later
			log.info(`${new Date} ${socket.id} disconnected`);
			console.log(WebSocket.connections);
		} catch (error) {
			log.error(error);
		}
	}

	public static Whisper(socket: Socket, dm: T.IWhisper): void {
		try {
			const user: T.IClient = WebSocket.connections.find(a => a.id === dm.id);
			if (!user) throw "this user does not exist";

			io.to(user.id).emit("dm", { ok: false, status: 500, data: dm.message } as T.IPaylaod);
			// prompt sender
			WebSocket.Respond(socket, { ok: true, status: 200, data: "message sent" });
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, status: 500, data: error });
		}
	}

	public static async Request(socket: Socket, request: T.IRequest): Promise<void> {
		try {
			log.info(request);
			const _response: AxiosResponse = await Rest.Get();
			WebSocket.Respond(socket, { ok: true, status: 200, data: _response });
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, status: 500, data: error });
		}
	}
}