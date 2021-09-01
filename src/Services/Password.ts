import argon from "argon2";

import { Config } from "./Config";

export class Password {

	private static readonly pepper = Config.Secrets.PEPPER;

	public static async Hash(password: string): Promise<string> {
		try {
			return await argon.hash(`${password}${Password.pepper}`, {
				type: argon.argon2id,
				timeCost: 5,
				saltLength: 20
			});
		} catch (error) {
			throw Error(error);
		}
	}

	public static async Compare(password: string, hash: string): Promise<boolean> {
		try {
			return await argon.verify(hash, `${password}${Password.pepper}`);
		} catch (error) {
			throw Error(error);
		}
	}
}
