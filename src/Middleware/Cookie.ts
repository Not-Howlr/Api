import plugin from "fastify-plugin";
import cookie from "fastify-cookie";
import { FastifyInstance } from "fastify";

import { Config } from "@Services/Config";

export default plugin(async (fastify: FastifyInstance): Promise<void> => {
	fastify.register(cookie, {
		secret: Config.Secrets.COOKIE_SECRET
	});
});