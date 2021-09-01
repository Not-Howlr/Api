import { createCipheriv, createDecipheriv } from "crypto";

import { Config } from "./Config";

export class Encryption {

	private static readonly iv = Config.Secrets.ENCRYPTION_IV;
	private static readonly key = Config.Secrets.ENCRYPTION_KEY;
	private static readonly algorithm = "aes-256-cbc";

	public static Encrypt(data: string): string {
		const cipher = createCipheriv(Encryption.algorithm, Encryption.key, Encryption.iv);
		let encrypted = cipher.update(data, "utf-8", "hex");
		return encrypted += cipher.final("hex");
	}

	public static Dencrypt(data: string): string {
		const decipher = createDecipheriv(Encryption.algorithm, Encryption.key, Encryption.iv);
		let decryptedData = decipher.update(data, "hex", "utf-8");
		return decryptedData += decipher.final("utf-8");
	}
}