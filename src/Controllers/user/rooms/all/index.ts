import { FastifyInstance } from "fastify";

import { Profile } from "@Models/Profile/Profile";
import { ProfileRepository } from "@Repositories/Profile/Profile";
import { ReuqestInstance } from "@Types/Override";

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.get<ReuqestInstance>("/:page", {
		preValidation: [fastify.authentication],
		schema: {
			tags: ["User"],
			summary: "get paginated rooms by user",
			description: "get paginated rooms by user",
			headers: {
				type: "object",
				required: ["cookie"],
				properties: {
					cookie: { type: "string" }
				}
			},
			params: {
				required: ["page"],
				type: "object",
				properties: {
					page: { type: "number", minimum: 1 }
				}
			},
			querystring: {
				required: ["limit"],
				type: "object",
				properties: {
					limit: { type: "number", maximum: 10 }
				}
			},
		}
	}, async (req, res) => {
		try {
			res.statusCode = 200;
			const { page } = req.params;
			const { limit } = req.query;
			const manager = req.em.getRepository(Profile);
			return {
				ok: true,
				rooms: await ProfileRepository.GetRooms(manager, req.user.uid, limit, page)
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};