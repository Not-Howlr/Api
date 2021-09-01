import { FastifyInstance } from "fastify";

import { ReuqestInstance } from "@Types/Override";
import { Jwt } from "@Services/Jwt";
import { Utility } from "@Services/Utility";
import { ProfileRepository } from "@Repositories/Profile/Profile";
import { Profile } from "@Models/Profile/Profile";

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post<ReuqestInstance>("/", {
		schema: {
			tags: ["User"],
			summary: "user register endpoint",
			description: "user register endpoint",
			body: {
				type: "object",
				required: ["username", "password", "email"],
				properties: {
					username: { type: "string" },
					password: { type: "string" },
					email: { type: "string" },
				}
			},
			response: {
				200: {
					type: "object",
					properties: {
						ok: { type: "boolean" },
						token: { type: "string" },
						user: {
							type: "object",
							properties: {
								uid: { type: "string" },
								username: { type: "string" },
								token_version: { type: "number" },
								is_verified: { type: "boolean" }
							}
						}
					}
				}
			}
		}
	}, async (req, res) => {
		try {
			res.statusCode = 200;
			const { username, password, email } = req.body;
			const manager = req.em.getRepository(Profile);
			const inserted = await ProfileRepository.Register(manager, { username, password, email });
			const token = Jwt.Sign(inserted);
			Utility.SetCookie(res, token);
			return {
				ok: true,
				token,
				user: inserted.toJSON()
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};