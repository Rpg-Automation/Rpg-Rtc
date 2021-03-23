import { Socket } from "socket.io";

import WebSocket from "../repositories/websocket";
import * as T from "../types/Payloads";
import io from "../services/server";

// Generic socket wrapper
io.on("connection", async (socket: Socket) => {

	await WebSocket.Connected(socket);

	socket.on("connected", async (discordID: string) => {
		console.log(discordID);
	});

	socket.on("oauth-creds", async (discordId: string) => {
		await WebSocket.OauthCred(socket, discordId);
	});

	// dm
	socket.on("whisper", (dm: T.IWhisper) => {
		WebSocket.Whisper(socket, dm);
	});

	// fetch api data
	socket.on("request", async (request: T.IRequest) => {
		WebSocket.Request(socket, request);
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

	socket.on("update-cooldowns", (cooldowns: T.Cooldowns) => {
		WebSocket.Cooldowns(socket, cooldowns);
	});

	// disconnect
	socket.on("disconnect", () => {
		WebSocket.Disconnect(socket);
	});
});

export default io;