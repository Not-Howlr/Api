import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";

import { Base } from "../Base";
import { ChatRoom } from "./ChatRoom";

@Entity()
export class Message extends Base {

	constructor(params: Partial<Message>) {
		super();
		Object.assign(this, params);
	}

	@ManyToOne(() => ChatRoom)
	room: ChatRoom;

	@Index()
	@Property()
	from_uid: string;

	@Index()
	@Property()
	to_uid: string;

	@Property({ length: 1000 })
	message_content: string;

	@Property({ type: Date, hidden: true })
	sent: Date = new Date();
}
