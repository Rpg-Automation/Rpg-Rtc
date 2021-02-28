import axios, { AxiosResponse } from "axios";

import config from "../helpers/config";
import * as T from "../types/Constants";
import { IPost } from "../types/Payloads";

export default class RestClient {

	private static base = config.IS_PROD ? T.Endpoints.prodUrl : T.Endpoints.devUrl;

	public static async Get(url?: string): Promise<AxiosResponse> {
		try {
			const response: AxiosResponse = await axios.get(`${RestClient.base}/${url || ""}`);
			return response.data;
		} catch (error) {
			throw Error(error);
		}
	}

	public static async Post(body: IPost, url?: string): Promise<AxiosResponse> {
		try {
			const response: AxiosResponse = await axios.post(`${RestClient.base}/${url || ""}`, body);
			return response.data;
		} catch (error) {
			throw Error(error);
		}
	}
}