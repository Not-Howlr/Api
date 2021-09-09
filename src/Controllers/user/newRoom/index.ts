import { FastifyInstance } from "fastify";

import { Profile } from "@Models/Profile/Profile";
import { ProfileRepository } from "@Repositories/Profile/Profile";
import { ReuqestInstance } from "@Types/Override";
import { ChatRoom } from "@Models/Messages/ChatRoom";

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post<ReuqestInstance>("/", {
		preValidation: [fastify.authentication],
		schema: {
			tags: ["User"],
			summary: "new chat room endpoint",
			description: "new chat room endpoint",
			headers: {
				type: "object",
				required: ["cookie"],
				properties: {
					cookie: { type: "string" }
				}
			},
			body: {
				type: "object",
				required: ["uids"],
				properties: {
					uids: { type: "array", items: { type: "string" } },
					name: { type: "string" },
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
	}, async (req, res) => {
		try {
			res.statusCode = 200;
			const manager = req.em.getRepository(Profile);
			const chatManager = req.em.getRepository(ChatRoom);
			const { uids, name } = req.body;
			await ProfileRepository.CreateRoom(chatManager, manager, [...uids, req.user.uid], name);
			return {
				ok: true
			};
		} catch (error) {
			throw new Error(error);
		}
	});
};