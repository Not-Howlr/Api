/* eslint-disable @typescript-eslint/no-unused-vars */
import { IDatabaseDriver, Connection, EntityManager, EntityRepository } from "@mikro-orm/core";
import { IUser } from "@not-howlr/types";
import { FastifyInstance, FastifyRequest } from "fastify";

declare module "fastify" {
	export interface FastifyInstance {
		authentication(): void
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
	password: string
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