import { BeforeCreate, Dictionary, Entity, Index, Property, wrap } from "@mikro-orm/core";

import { Base } from "@Models/Base";
import { Password } from "@Services/Password";

@Entity()
export class Profile extends Base {

	constructor(params: Partial<Profile>) {
		super();
		Object.assign(this, params);
	}

	@Index()
	@Property({ unique: true })
	username: string;

	@Property({ unique: true })
	email: string;

	@Property({ hidden: true })
	password: string;

	@Property({ default: 0 })
	token_version = 0;

	@Property({ default: false })
	is_verified = false;

	@BeforeCreate()
	public async HashPassword(): Promise<void> {
		this.password = await Password.Hash(this.password);
	}

	public toJSON(): Dictionary<Profile> {
		return wrap(this).toObject();
	}
}
