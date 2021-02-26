import axios, { AxiosResponse } from "axios";

import config from "../helpers/config";
import { Endpoints } from "../types/Constants";

export default class RestClient {

	private static base = config.IS_PROD ? Endpoints.prodUrl : Endpoints.devUrl;

	public static async Get(url?: string): Promise<AxiosResponse> {
		try {
			const response: AxiosResponse = await axios.get(`${RestClient.base}/${url || ""}`);
			return response.data;
		} catch (error) {
			throw Error(error);
		}
	}
}