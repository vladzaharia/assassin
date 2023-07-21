import { Context } from "hono";
import { Bindings } from "../bindings";

export const PlayerAuth = async (c: Context<{ Bindings: Bindings }>) => {
	const { name: nameParam } = c.req.param()
	const name = c.req.header('X-Assassin-User')

	console.log(`Player Auth: ${name}, param = ${nameParam}`)
	return nameParam === name
}
