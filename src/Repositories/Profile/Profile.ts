import { EntityRepository } from "@mikro-orm/core";
import { UserPassword } from "@Models/Profile/UserPassword";

import { Profile } from "@Models/Profile/Profile";
import { Password } from "@Services/Password";
import { Utility } from "@Services/Utility";

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
				password: new UserPassword({ hash: login.password })
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
}