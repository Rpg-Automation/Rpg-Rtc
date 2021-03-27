import { Socket } from "socket.io";

import WebSocket from "../repositories/websocket";
import * as T from "../types/Payloads";
import io from "../services/server";

// Generic socket wrapper
io.on("connection", async (socket: Socket) => {

	await WebSocket.Connected(socket);

	socket.on("connected", async (token: string) => {
		console.log(token);
	});

	socket.on("oauth-creds", async (token: string) => {
		await WebSocket.OauthCred(socket, token);
	});

	// dm
	socket.on("whisper", (dm: T.IWhisper) => {
		WebSocket.Whisper(socket, dm);
	});

	// fetch api data
	socket.on("request", async (request: T.IRequest) => {
		WebSocket.Request(socket, request);
	});

	socket.on("dashboard-stop", (token: string) => {
		WebSocket.AuthorizedStop(socket, token);
	});

	socket.on("dashboard-start", (token: string) => {
		WebSocket.AuthorizedStart(socket, token);
	});

	socket.on("request-stop", (id: string) => {
		WebSocket.Stop(socket, id);
	});

	socket.on("request-start", (id: string) => {
		WebSocket.Start(socket, id);
	});

	socket.on("request-pause", (id: string) => {
		WebSocket.Pause(socket, id);
	});

	socket.on("request-resume", (id: string) => {
		WebSocket.Resume(socket, id);
	});

	socket.on("request-status", (token: string) => {
		WebSocket.RequestStatus(socket, token);
	});

	socket.on("update-status", (token: string, status: boolean) => {
		WebSocket.Status(socket, token, status);
	});

	socket.on("request-cooldowns", (token: string) => {
		WebSocket.RequestCooldowns(socket, token);
	});

	socket.on("update-cooldowns", (cooldowns: T.Cooldowns) => {
		WebSocket.Cooldowns(socket, cooldowns);
	});

	// disconnect
	socket.on("disconnect", () => {
		WebSocket.Disconnect(socket);
	});
});

export default io;