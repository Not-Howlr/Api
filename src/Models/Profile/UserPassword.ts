import { BeforeCreate, Dictionary, Entity, Property, wrap } from "@mikro-orm/core";

import { Base } from "@Models/Base";
import { Password } from "@Services/Password";

@Entity()
export class UserPassword extends Base {

	constructor(params: Partial<UserPassword>) {
		super();
		Object.assign(this, params);
	}

	@Property({ type: String, hidden: true })
	hash: string;

	@Property({ type: Number, default: 0 })
	login_attempts = 0;

	@Property({ type: Date, nullable: true })
	cooldown: Date | null;

	@BeforeCreate()
	public async HashPassword(): Promise<void> {
		this.hash = await Password.Hash(this.hash);
	}

	public toJSON(): Dictionary<UserPassword> {
		return wrap(this).toObject();
	}
}
