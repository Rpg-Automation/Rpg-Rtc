import { Server } from "socket.io";

const options = {
	withCredentials: true,
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
};

export default new Server(options);