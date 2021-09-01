import { Dictionary, Entity, Index, OneToOne, Property, wrap } from "@mikro-orm/core";

import { Base } from "@Models/Base";
import { UserPassword } from "./UserPassword";

@Entity()
export class Profile extends Base {

	constructor(params: Partial<Profile>) {
		super();
		Object.assign(this, params);
	}

	@Index()
	@Property({ type: String, unique: true })
	username: string;

	@Property({ type: String, unique: true })
	email: string;

	@OneToOne({ type: UserPassword, owner: true, eager: true, orphanRemoval: true, hidden: true })
	password: UserPassword;

	@Property({ type: Number, default: 0 })
	token_version = 0;

	@Property({ type: Boolean, default: false })
	is_verified = false;

	public toJSON(): Dictionary<Profile> {
		return wrap(this).toObject();
	}
}
