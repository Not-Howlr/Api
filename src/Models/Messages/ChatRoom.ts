import { Collection, Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";

import { Base } from "../Base";
import { Message } from "./Message";
import { Profile } from "@Models/Profile/Profile";

@Entity()
export class ChatRoom extends Base {

	constructor(params?: Partial<ChatRoom>) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: String, nullable: true })
	name: string;

	@ManyToMany(() => Profile, profile => profile.chat_rooms)
	members = new Collection<Profile>(this);

	@OneToMany(() => Message, message => message.room, { nullable: true, orphanRemoval: true })
	messages = new Collection<Message>(this);

	@Property({ type: Number, default: 0 })
	unread_messages = 0;
}
