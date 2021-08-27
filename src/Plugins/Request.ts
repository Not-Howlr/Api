import plugin from "fastify-plugin";
import { FastifyInstance, FastifyRequest } from "fastify";

import { Database } from "@Services/Database";

export default plugin(async (fastify: FastifyInstance): Promise<void> => {
	fastify.addHook("onRequest", async (request: FastifyRequest) => {
		request.em = Database.Manager.fork();
	});
});