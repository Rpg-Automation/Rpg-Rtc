import { Socket } from "socket.io";
import { AxiosResponse } from "axios";

import * as T from "../types/Payloads";
import Rest from "../services/rest";
import io from "../services/server";
import log from "../services/logger";

export default class WebSocket {

	private static connections: T.IClient[] = [];

	private static oauthConnections: T.OauthCred[] = [];

	public static Respond(socket: Socket, payload: T.IPaylaod): void {
		socket.emit("response", { ok: payload.ok, data: payload.data });
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

			io.to(user.id).emit("dm", { ok: false, data: dm.message } as T.IPaylaod);
			// prompt sender
			WebSocket.Respond(socket, { ok: true, data: "message sent" });
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static OauthCred(socket: Socket, discordId: string): void {
		try {
			socket.join(discordId);
			io.to(discordId).emit("success", `${new Date()} you have connected ${discordId}`);
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static Stop(socket: Socket, id: string): void {
		try {
			const user: T.IClient = WebSocket.connections.find(a => a.id === id);
			if (!user) throw "this user does not exist";

			io.to(user.id).emit("client-stop", "blah");
			// prompt sender
			WebSocket.Respond(socket, { ok: true, data: "message sent" });
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static async Request(socket: Socket, request: T.IRequest): Promise<void> {
		try {
			log.info(request);
			console.log(request);
			const _response: AxiosResponse = await Rest.Get();
			WebSocket.Respond(socket, { ok: true, data: _response });
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}
}