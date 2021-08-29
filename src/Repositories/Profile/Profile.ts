import { EntityRepository } from "@mikro-orm/core";

import { Profile } from "@Models/Profile/Profile";
import { Password } from "@Services/Password";

export interface ILogin {
	username: string,
	password: string
}
export interface IRegister extends ILogin { email: string }

type RequestRepo = EntityRepository<Profile>;

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
				password: login.password
			});
			manager.persistAndFlush(newProfile);
			return newProfile;
		} catch (error) {
			throw new Error(error);
		}
	}

	public static async Login(manager: RequestRepo, login: ILogin): Promise<Profile> {
		try {
			const exists = await manager.findOne({ username: login.username });
			if (!exists) throw "username not found";

			const match = await Password.Compare(login.password, exists.password);
			if (!match) throw "incorrect password";
			return exists;
		} catch (error) {
			throw new Error(error);
		}
	}
}