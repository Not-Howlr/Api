import { FastifyInstance } from "fastify";

import { Utility } from "@Services/Utility";

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post("/", {
		preValidation: [fastify.authentication],
		schema: {
			tags: ["User"],
			summary: "user logout endpoint",
			description: "user logout endpoint",
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
						ok: { type: "boolean" }
					}
				}
			}
		}
	}, async (_, res) => {
		try {
			res.statusCode = 200;
			Utility.ClearCookie(res);
			return {
				ok: true
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};