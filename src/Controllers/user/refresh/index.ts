import { FastifyInstance } from "fastify";

import { Jwt } from "@Services/Jwt";

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post("/", {
		preValidation: [fastify.client, fastify.authentication],
		schema: {
			tags: ["User"],
			summary: "user refresh endpoint",
			description: "user refresh endpoint",
			headers: {
				type: "object",
				required: ["Authorization"],
				properties: {
					Authorization: { type: "string" }
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
			return {
				ok: true,
				token: Jwt.Sign(req.user),
				user: req.user
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};