import jwt from "jsonwebtoken";
import { IUser } from "@not-howlr/types";

import { Config } from "./Config";
import { Encryption } from "./Encryption";

export class Jwt {

	private static readonly PrivateSecret = Config.Secrets.PRIVATE_KEY;
	private static readonly PublicSecret = Config.Secrets.PUBLIC_KEY;

	public static Sign(user: IUser): string {
		const token = jwt.sign({
			uid: user.uid,
			username: user.username,
			token_version: user.token_version,
			is_verified: user.is_verified
		}, Jwt.PrivateSecret, { algorithm: "RS256" });
		return Encryption.Encrypt(token);
	}

	public static Verify(token: string): IUser {
		const decoded = Encryption.Dencrypt(token);
		return jwt.verify(decoded, Jwt.PublicSecret, { algorithms: ["RS256"] }) as IUser;
	}
}