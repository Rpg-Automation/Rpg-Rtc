
export interface IRequest {
	test: string
}

export interface IPaylaod {
	ok: boolean,
	status: number,
	data: any
}

export interface IPost {
	data: any
}

export interface IClient {
	id: string,
	connected: Date
}

export interface IWhisper {
	id: string,
	message: string
}