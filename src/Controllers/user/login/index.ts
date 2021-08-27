import { FastifyInstance } from "fastify";

import { ReuqestInstance } from "@Types/Override";
import { Jwt } from "@Services/Jwt";

const users = [
	{ uid: "12345", token_version: 1, is_verified: false, username: "dev", password: "dev" },
	{ uid: "6789", token_version: 1, is_verified: false, username: "judeboy", password: "1234" },
	{ uid: "6969", token_version: 1, is_verified: false, username: "badonn", password: "yiff" }
];

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post<ReuqestInstance>("/", {
		preValidation: [fastify.client],
		schema: {
			tags: ["User"],
			summary: "user login endpoint",
			description: "user login endpoint",
			body: {
				type: "object",
				required: ["username", "password"],
				properties: {
					username: { type: "string" },
					password: { type: "string" }
				}
			},
			response: {
				200: {
					type: "object",
					properties: {
						ok: { type: "boolean" },
						token: { type: "string" }
					}
				}
			}
		}
	}, async (req, res) => {
		try {
			res.statusCode = 200;
			const { username, password } = req.body;
			const found = users.find(a => a.username == username);
			if (!found) throw "invalid username or password";
			if (found.password !== password) throw "invalid username or password";
			return {
				ok: true,
				token: Jwt.Sign(found)
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};