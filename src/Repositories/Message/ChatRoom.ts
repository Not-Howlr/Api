import { EntityRepository } from "@mikro-orm/core";
import { INewMessage } from "@not-howlr/types";

import { Message } from "@Models/Messages/Message";
import { ChatRoom } from "@Models/Messages/ChatRoom";
import { Profile } from "@Models/Profile/Profile";

type ChatRoomRepo = EntityRepository<ChatRoom>;
type ProfileRepo = EntityRepository<Profile>;

export class ChatRoomRepository {

	public static async InsertMessage(chatRoom: ChatRoomRepo, profile: ProfileRepo, roomUid: string, message: INewMessage): Promise<boolean> {
		try {
			const user = await profile.findOne({ uid: message.from });
			if (!user) throw "user not found";
			const currentRoom = user.chat_rooms.getItems().find(a => a.uid == roomUid);
			if (!currentRoom) throw "room not found";
			currentRoom.messages.add(
				new Message({
					to_uid: message.to,
					from_uid: message.from,
					message_content: message.content,
					sent: message.sent
				})
			);
			await chatRoom.persistAndFlush(currentRoom);
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async GetMessagesByRoom(profile: ProfileRepo, userUid: string, roomUid: string): Promise<Message[]> {
		try {
			const user = await profile.findOne({ uid: userUid });
			if (!user) throw "user not found";
			const currentRoom = user.chat_rooms.getItems(true).find(a => a.uid == roomUid);
			if (!currentRoom) throw "room not found";
			await currentRoom.messages.loadItems();
			return currentRoom.messages.getItems();
		} catch (error) {
			throw new Error(error);
		}
	}
}