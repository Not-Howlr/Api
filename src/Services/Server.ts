
import path from "path";
import { cwd } from "process";
import fastify, { FastifyError } from "fastify";
import AutoLoad from "fastify-autoload";
import { ServerHandler, INewMessage } from "@not-howlr/types";
import { Socket } from "socket.io";

import { Config } from "./Config";
import { Database } from "./Database";
import { Log } from "./Logger";
import { Handler } from "./Websocket";

const { Options } = Config;

export class App {

	private static instance = fastify({ logger: !Options.IS_PROD });

	private static async Setup(): Promise<void> {
		App.instance.register(import("../Plugins/Request"));
		App.instance.register(import("../Plugins/Authentication"));
		App.instance.register(AutoLoad, {
			dir: path.join(cwd(), "build/Middleware"),
		});
		App.instance.register(AutoLoad, {
			dir: path.join(cwd(), "build/Controllers"),
			options: { prefix: `/api/${Options.APP_VERSION}/` },
			routeParams: false
		});
		App.instance.setErrorHandler(async (error: FastifyError) => {
			Log.Error(error, error.stack as string, "application error");
			return {
				ok: false,
				status: error.statusCode ?? 500,
				data: error.message
			};
		});
	}

	public static async Start(): Promise<void> {
		try {
			await Database.Connect();
			await App.Setup();
			await App.instance.listen(Options.PORT, Options.IS_PROD ? "0.0.0.0" : Options.HOST);
			try {
				App.instance.io.on(ServerHandler.CONNECTION, async (socket: Socket) => {
					await Handler.Connect(socket);
					socket.on(ServerHandler.SEND_MESSAGE, async (data: INewMessage) => await Handler.SendMessage(socket, data));
				});
			} catch (error) {
				Log.Error(error, error.stack || error.stackTrace, "Websocket Service");
			}
		} catch (e) {
			Log.Error(e, e.stack || e.stackTrace, "Application Error");
		}
	}
}