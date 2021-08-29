import { FastifyReply } from "fastify/types/reply";

import { Config } from "./Config";

enum CookieNames {
	JID = "jid"
}

export class Utility {

	public static CreateUuid(): string {
		let dt = new Date().getTime();
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	public static SetCookie(response: FastifyReply, token: string): void {
		try {
			response.setCookie(CookieNames.JID, token, {
				httpOnly: true,
				path: "/",
				// maxAge: 60 * 60 * 24, // 1 day
				secure: Config.Options.IS_PROD,
				signed: false,
				sameSite: true
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	public static ClearCookie(response: FastifyReply): void {
		try {
			response.clearCookie(CookieNames.JID, {
				httpOnly: true,
				path: "/",
				maxAge: 0,
				secure: Config.Options.IS_PROD,
				signed: true,
				sameSite: true
			});
		} catch (error) {
			throw new Error(error);
		}
	}
}