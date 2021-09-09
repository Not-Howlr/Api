/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser, ServerHandler, INewMessage } from "@not-howlr/types";
import { Socket } from "socket.io";

import { Jwt } from "./Jwt";
import { Log } from "./Logger";
import { Database } from "./Database";
import { ChatRoomRepository } from "@Repositories/Message/ChatRoom";
import { Profile } from "@Models/Profile/Profile";
import { ChatRoom } from "@Models/Messages/ChatRoom";

export class Handler {

	private static Verify(socket: Socket): IUser | undefined {
		try {
			const cookie = socket.handshake.headers.cookie;
			const jid = cookie && cookie.split("jid=")[1];
			const auth = jid && Jwt.Verify(jid);
			if (!auth) socket.disconnect();
			return auth as IUser;
		} catch (error) {
			Log.Error(error, error.stack || error.stackTrace, "Websocket Service");
			return undefined;
		}
	}

	private static Respond(socket: Socket, data: any): void {
		try {
			socket.emit(ServerHandler.RESPONSE, { ok: true, data });
		} catch (error) {
			Log.Error(error, error.stack || error.stackTrace, "Websocket Service");
		}
	}

	private static RecieveMessage(socket: Socket, to: string, data: INewMessage): void {
		try {
			socket.to(to).emit(ServerHandler.RECIEVE_MESSAGE, { ok: true, data });
		} catch (error) {
			Log.Error(error, error.stack || error.stackTrace, "Websocket Service");
		}
	}

	public static async SendMessage(socket: Socket, data: INewMessage): Promise<void> {
		try {
			const user = Handler.Verify(socket) as IUser;
			if (!data.room_uid) throw "room uid required";
			const chatManager = Database.Manager.fork().getRepository(ChatRoom);
			const userManager = Database.Manager.fork().getRepository(Profile);
			const now = new Date();
			await ChatRoomRepository.InsertMessage(chatManager, userManager, data.room_uid, {
				from: user.uid,
				to: data.to,
				content: data.content,
				sent: now
			});
			Handler.RecieveMessage(socket, data.to, { ...data, from: user.username, sent: now });
			Handler.Respond(socket, "message sent");
		} catch (error) {
			Log.Error(error, error.stack || error.stackTrace, "Websocket Service");
		}
	}

	public static async Connect(socket: Socket): Promise<void> {
		try {
			const user = Handler.Verify(socket) as IUser;
			await socket.join(user.uid);
			Handler.Respond(socket, `joined room ${user.uid}`);
		} catch (error) {
			Log.Error(error, error.stack || error.stackTrace, "Websocket Service");
		}
	}
}