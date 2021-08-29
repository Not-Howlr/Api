import plugin from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Jwt } from "@Services/Jwt";
import { ProfileRepository } from "@Repositories/Profile/Profile";
import { Profile } from "@Models/Profile/Profile";

export default plugin(async (fastify: FastifyInstance): Promise<void> => {
	fastify.decorate("authentication", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const auth = request.headers.cookie;
			if (!auth) throw "missing auth";

			const token = auth.split("=")[1];
			if (!token) throw "missing token";

			const deserialized = Jwt.Verify(token);

			const manager = request.em.getRepository(Profile);

			const user = await ProfileRepository.FindByUid(manager, deserialized.uid);

			if (user.token_version !== deserialized.token_version) throw "invalid token version";

			request.user = user;
		} catch (error) {
			reply.statusCode = 401;
			throw new Error(error);
		}
	});
});