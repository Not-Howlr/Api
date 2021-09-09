/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDatabaseDriver, Connection, EntityManager, EntityRepository } from "@mikro-orm/core";
import { IUser } from "@not-howlr/types";
import { Server } from "socket.io";
import { FastifyInstance, FastifyRequest } from "fastify";

declare module "fastify" {
	export interface FastifyInstance {
		authentication(): void,
		io: Server
	}

	export interface FastifyRequest {
		em: EntityManager<IDatabaseDriver<Connection>>,
		user: IUser
	}
}

interface IQuery {
	limit: number
}

interface IBody {
	username: string,
	email: string,
	password: string,
	uids: string[],
	uid: string,
	name: string
}

interface IParams {
	page: number,
	id: number,
	uid: string
}

export interface ReuqestInstance extends FastifyRequest {
	Body: IBody,
	Querystring: IQuery,
	Params: IParams
}