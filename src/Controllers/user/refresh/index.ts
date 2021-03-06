import { FastifyInstance } from "fastify";

import { Jwt } from "@Services/Jwt";
import { Utility } from "@Services/Utility";

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post("/", {
		preValidation: [fastify.authentication],
		schema: {
			tags: ["User"],
			summary: "user refresh endpoint",
			description: "user refresh endpoint",
			headers: {
				type: "object",
				required: ["cookie"],
				properties: {
					cookie: { type: "string" }
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
			const token = Jwt.Sign(req.user);
			Utility.SetCookie(res, token);
			return {
				ok: true,
				token,
				user: req.user
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};