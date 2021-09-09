import { FastifyInstance } from "fastify";

import { Profile } from "@Models/Profile/Profile";
import { ReuqestInstance } from "@Types/Override";
import { ChatRoomRepository } from "@Repositories/Message/ChatRoom";

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.get<ReuqestInstance>("/:uid", {
		preValidation: [fastify.authentication],
		schema: {
			tags: ["User"],
			summary: "get messages by room",
			description: "get messages by room",
			headers: {
				type: "object",
				required: ["cookie"],
				properties: {
					cookie: { type: "string" }
				}
			},
			params: {
				type: "object",
				required: ["uid"],
				properties: {
					uid: { type: "string" }
				}
			}
		}
	}, async (req, res) => {
		try {
			res.statusCode = 200;
			const { uid } = req.params;
			const manager = req.em.getRepository(Profile);
			return {
				ok: true,
				messages: await ChatRoomRepository.GetMessagesByRoom(manager, req.user.uid, uid)
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};