import { Socket } from "socket.io";

import WebSocket from "../repositories/websocket";
import * as T from "../types/Payloads";
import io from "../services/server";

// Generic socket wrapper
io.on("connection", async (socket: Socket) => {

	const { discordID } = socket.handshake.query;
	if (discordID) {
		const ID: string = Array.isArray(discordID) ? discordID[0] : discordID;

		if (ID) {
			await WebSocket.OauthCred(socket, ID);
		}
	}

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

	// disconnect
	socket.on("disconnect", () => {
		WebSocket.Disconnect(socket);
	});
});

export default io;