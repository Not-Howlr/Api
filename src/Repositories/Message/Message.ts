import { EntityRepository } from "@mikro-orm/core";
import { INewMessage } from "@not-howlr/types";

import { Message } from "@Models/Messages/Message";

type RequestRepo = EntityRepository<Message>;

export class MessageRepository {

	public static async Insert(manager: RequestRepo, message: INewMessage): Promise<boolean> {
		try {
			const newMessage = new Message({
				to_uid: message.to,
				from_uid: message.from,
				message_content: message.content,
				sent: message.sent
			});
			await manager.persistAndFlush(newMessage);
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}
}