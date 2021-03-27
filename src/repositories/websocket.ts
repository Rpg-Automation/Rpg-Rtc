import { Socket } from "socket.io";
import { AxiosResponse } from "axios";

import * as T from "../types/Payloads";
import Rest from "../services/rest";
import io from "../services/server";
import log from "../services/logger";
import Jwt from "../helpers/jwt";

export default class WebSocket {

	private static connections: T.IClient[] = [];

	public static async Connected(socket: Socket): Promise<void> {
		try {
			const { client_token } = socket.handshake.query;
			if (client_token) {
				const token: string = Array.isArray(client_token) ? client_token[0] : client_token;

				if (token) {
					await WebSocket.OauthCred(socket, token);
				}
			}
		}
		catch (error) {
			log.error(error);
		}
	}

	public static async OauthCred(socket: Socket, token: string): Promise<void> {
		try {
			const discordID: string = await Jwt.GetID(token);

			WebSocket.connections.push({ id: socket.id, discordID: discordID, connected: new Date() });
			console.log(WebSocket.connections);
			await socket.join(discordID);
			io.to(discordID).emit("success", `${new Date()} you have connected ${discordID}`);
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
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

	public static Respond(socket: Socket, payload: T.IPayload): void {
		socket.emit("response", { ok: payload.ok, data: payload.data });
	}

	public static Whisper(socket: Socket, dm: T.IWhisper): void {
		try {
			const user: T.IClient = WebSocket.connections.find(a => a.id === dm.id);
			if (!user) throw "this user does not exist";

			io.to(user.id).emit("dm", { ok: false, data: dm.message } as T.IPayload);
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
			const _response: AxiosResponse = await Rest.Get();
			WebSocket.Respond(socket, { ok: true, data: _response });
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static async AuthorizedStop(socket: Socket, token: string): Promise<void> {
		try {
			const id: string = await Jwt.GetID(token);

			io.to(id).emit("client-stop");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static async AuthorizedStart(socket: Socket, token: string): Promise<void> {
		try {
			const id: string = await Jwt.GetID(token);

			io.to(id).emit("client-start");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static Stop(socket: Socket, id: string): void {
		try {
			io.to(id).emit("client-stop");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static Start(socket: Socket, id: string): void {
		try {
			io.to(id).emit("client-start");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static Pause(socket: Socket, id: string): void {
		try {
			io.to(id).emit("client-pause");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static Resume(socket: Socket, id: string): void {
		try {
			io.to(id).emit("client-resume");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static async RequestCooldowns(socket: Socket, token: string): Promise<void> {
		try {
			const id: string = await Jwt.GetID(token);

			io.to(id).emit("request-cooldowns");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static Cooldowns(socket: Socket, cooldowns: T.Cooldowns): void {
		try {
			io.to(cooldowns.id).emit("client-cooldowns", cooldowns.commands);
		}
		catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static async RequestStatus(socket: Socket, token: string): Promise<void> {
		try {
			const id: string = await Jwt.GetID(token);

			io.to(id).emit("request-status");
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}

	public static async Status(socket: Socket, token: string, status: boolean): Promise<void> {
		try {
			const id: string = await Jwt.GetID(token);

			io.to(id).emit("update-status", status);
		} catch (error) {
			log.error(error);
			WebSocket.Respond(socket, { ok: false, data: error });
		}
	}
}