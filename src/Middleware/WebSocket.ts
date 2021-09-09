import plugin from "fastify-plugin";
import socket from "fastify-socket.io";
import { FastifyInstance } from "fastify";

export default plugin(async (fastify: FastifyInstance): Promise<void> => {
	fastify.register(socket, {
		cors: {
			allowedHeaders: ["jid"],
			credentials: true,
			methods: ["GET", "POST"]
		}
	});
});