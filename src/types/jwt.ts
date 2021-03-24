/**
 * a jwt payload object
 * 
 * iat and exp are optional because the jsonwebtoken library will add them on at signing
 * @export
 * @interface IJwtPayload
 */
export interface IJwtPayload {
	id: string,
	username: string,
	discriminator: string,
	avatar: string,
	iat?: number,
	exp?: number
}