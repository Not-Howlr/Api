import { EntityRepository } from "@mikro-orm/core";

import { UserPassword } from "@Models/Profile/UserPassword";
import { Profile } from "@Models/Profile/Profile";
import { Password } from "@Services/Password";
import { Utility } from "@Services/Utility";
import { ChatRoom } from "@Models/Messages/ChatRoom";

export interface ILogin {
	username: string,
	password: string
}
export interface IRegister extends ILogin { email: string }

interface IRoomResults {
	room: {
		updatedAt: Date,
		name: string,
		uid: string,
		unread_messages: number
	},
	members: {
		uid: string,
		username: string
	}[]
}

type RequestRepo = EntityRepository<Profile>;
type ChatRequestRepo = EntityRepository<ChatRoom>;

export class ProfileRepository {

	public static async FindById(manager: RequestRepo, id: number): Promise<Profile> {
		try {
			const profile = await manager.findOne({ id }, { cache: 3000 });
			if (!profile) throw "profile not found";
			return profile;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async FindByUid(manager: RequestRepo, uid: string): Promise<Profile> {
		try {
			const profile = await manager.findOne({ uid }, { cache: 3000 });
			if (!profile) throw "profile not found";
			return profile;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Register(manager: RequestRepo, login: IRegister): Promise<Profile> {
		try {
			const exists = await manager.findOne({
				$or: [
					{ username: login.username },
					{ email: login.email },
				]
			});
			if (exists) throw "username / email in use";

			const newProfile = new Profile({
				username: login.username,
				email: login.email,
				password: new UserPassword({ hash: login.password })
			});
			await manager.persistAndFlush(newProfile);
			return await manager.findOneOrFail({
				$and: [
					{ email: login.email },
					{ username: login.username },
				]
			});
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Login(manager: RequestRepo, login: ILogin): Promise<Profile> {
		try {
			const exists = await manager.findOne({ username: login.username });
			if (!exists) throw "username not found";

			const diff = exists.password.cooldown && Utility.GetDiffInMin(new Date(), exists.password.cooldown);
			if (diff && diff < 10) throw "please try again later";

			const match = await Password.Compare(login.password, exists.password.hash);
			if (!match) {
				if (exists.password.login_attempts >= 10) {
					exists.password.cooldown = new Date();
					await manager.persistAndFlush(exists);
					throw "too many failed attempts. please try again later";
				}
				exists.password.login_attempts += 1;
				await manager.persistAndFlush(exists);
				throw "incorrect password";
			}
			if (exists.password.login_attempts > 0) {
				exists.password.login_attempts = 0;
				exists.password.cooldown = null;
				await manager.persistAndFlush(exists);
			}
			return exists;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async CreateRoom(chatRepo: ChatRequestRepo, manager: RequestRepo, memberUids: string[], chatName?: string): Promise<ChatRoom> {
		try {
			const newRoom = new ChatRoom({
				name: chatName
			});
			for (const uid of memberUids) {
				const member = await manager.findOne({ uid });
				if (!member) throw "user not found";
				member.chat_rooms.add(newRoom);
				newRoom.members.add(member);
				manager.persist(member);
				chatRepo.persist(newRoom);
			}
			await manager.flush();
			await chatRepo.flush();
			return newRoom;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async GetRooms(manager: RequestRepo, uid: string, limit: number, pageNumber: number): Promise<IRoomResults[]> {
		try {
			const member = await manager.findOne({ uid });
			if (!member) throw "user not found";
			const rooms = await member.chat_rooms.matching({
				limit,
				offset: (pageNumber - 1) * limit,
				orderBy: { updatedAt: "DESC" }
			});
			const _rooms = [];
			for (const room of rooms) {
				const _members = [];
				const members = await room.members.loadItems();
				for (const member of members) {
					_members.push({
						uid: member.uid,
						username: member.username
					});
				}
				_rooms.push({
					room: {
						updatedAt: room.updatedAt,
						name: room.name ?? "",
						uid: room.uid,
						unread_messages: room.unread_messages
					},
					members: _members
				});
			}
			return _rooms;
		} catch (error) {
			throw new Error(error);
		}
	}
}