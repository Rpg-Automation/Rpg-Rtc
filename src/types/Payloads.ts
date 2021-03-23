
export interface IRequest {
	test: string
}

export interface IPayload {
	ok: boolean,
	data: any
}

export interface IPost {
	data: any
}

export interface IClient {
	id: string,
	discordID: string,
	connected: Date
}

export interface IWhisper {
	id: string,
	message: string
}

export interface OauthCred {
	socketId: string,
	id: string,
	userName: string,
	disc: number
}

export interface Cooldowns {
	id: string,
	commands: Command[]
}

export interface Command {
	type: string;
	available: Date;
}