import { BeforeCreate, Index, PrimaryKey, Property } from "@mikro-orm/core";

import { Utility } from "@Services/Utility";

export abstract class Base {

	@PrimaryKey({ hidden: true })
	id!: number;

	@Index()
	@Property({ type: String })
	uid!: string;

	@Property({ type: Date, hidden: true })
	createdAt: Date = new Date();

	@Property({ onUpdate: () => new Date(), type: Date, hidden: true })
	updatedAt: Date = new Date();

	@Property({ type: Boolean, default: false, hidden: true })
	deleted = false;

	@BeforeCreate()
	public CreateUid(): void {
		this.uid = Utility.CreateUuid();
	}
}
