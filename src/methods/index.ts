import { Socket } from "socket.io";

import WebSocket from "../repositories/websocket";
import * as T from "../types/Payloads";
import io from "../services/server";

// Generic socket wrapper
io.on("connection", (socket: Socket) => {

	console.log(socket);
	// initial connect
	WebSocket.Connect(socket);

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

	socket.on("client-stop", (id: string) => {
		WebSocket.Stop(socket, id);
	});

	socket.on("client-start", (id: string) => {
		WebSocket.Start(socket, id);
	});

	// disconnect
	socket.on("disconnect", () => {
		WebSocket.Disconnect(socket);
	});
});

export default io;