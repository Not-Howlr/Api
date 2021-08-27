import { FastifyInstance } from "fastify";

import { ReuqestInstance } from "@Types/Override";

const users = [
	{ username: "dev", password: "dev" },
	{ username: "", password: "" },
	{ username: "", password: "" }
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
						user: {
							type: "object",
							properties: {
								username: { type: "string" }
							}
						}
					}
				}
			}
		}
	}, async (req, res) => {
		try {
			res.statusCode = 200;
			const { username, password } = req.body;
			console.log(username, password);
			const found = users.find(a => a.username == username);
			if (!found) throw "username not found";
			if (found.password !== password) throw "incorrect password";
			return {
				ok: true,
				user: found
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};