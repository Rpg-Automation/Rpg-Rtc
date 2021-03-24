import jwt from "jsonwebtoken";

import config from "./config";
import { IJwtPayload } from "../types/jwt";

export default class Jwt {

	/**
	 *
	 * decode a jsonwebtoken
	 * @static
	 * @param {string} token
	 * @return {*}  {Promise<IJwtPayload>}
	 * @memberof Jwt
	 */
	public static async Verify(token: string): Promise<IJwtPayload> {
		return new Promise((resolve, reject) => {
			try {
				const data = jwt.verify(token, config.JWT_SECRET) as IJwtPayload;
				return resolve({
					id: data.id,
					avatar: data.avatar,
					username: data.username,
					discriminator: data.discriminator,
					iat: data.iat,
					exp: data.exp
				});
			} catch (error) {
				return reject(error);
			}
		});
	}

	/**
	 *
	 * decode a jsonwebtoken into discordID
	 * @static
	 * @param {string} token
	 * @return {*}  {Promise<string>}
	 * @memberof Jwt
	 */
	public static async GetID(token: string): Promise<string> {
		if (token == null) throw "missing jwt";

		const payload = await Jwt.Verify(token);
		if (!payload) throw "invalid jwt";

		return payload.id;
	}
}