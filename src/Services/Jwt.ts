import jwt from "jsonwebtoken";
import { IUser } from "@not-howlr/types";

import { Config } from "./Config";

export class Jwt {

	private static readonly Secret = Config.Secrets.JWT_SECRET;

	public static Sign(user: IUser): string {
		return jwt.sign({
			uid: user.uid,
			username: user.username,
			token_version: user.token_version,
			is_verified: user.is_verified
		}, Jwt.Secret);
	}

	public static Verify(token: string): IUser {
		return jwt.verify(token, Jwt.Secret) as IUser;
	}
}