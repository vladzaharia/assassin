import { Context, Next } from "hono"
import { jwt } from 'hono/jwt'

import { Bindings } from "./types"

type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE"
export const SECURE_ENDPOINTS: { path: RegExp, methods: HTTPMethods[] }[] = [
	{
		path: /room\/\w*/,
		methods: ["PUT", "DELETE"]
	},
	{
		path: /room\/\w*\/(start|reset)/,
		methods: ["POST"]
	},
	{
		path: /room\/\w*\/player\/\w*/,
		methods: ["PUT", "DELETE"]
	},
	{
		path: /room\/\w*\/player\/\w*/,
		methods: ["PUT", "DELETE"]
	},
	{
		path: /wordlist\/\w*/,
		methods: ["PUT", "DELETE"]
	},
	{
		path: /wordlist\/\w*\/words/,
		methods: ["PUT", "DELETE"]
	},
]

export const checkPath = (path: string, method: string) => {
	for (const secureEndpoint of SECURE_ENDPOINTS) {
		if (path.match(secureEndpoint.path) && secureEndpoint.methods.includes(method as HTTPMethods)) {
			return true
		}
	}
	return false
}

export const AuthMiddleware = async (c: Context<{Bindings: Bindings}>, next: Next) => {
	const secret = await c.env.OPENID.get("secret")
	if (checkPath(c.req.path, c.req.method) && secret) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return jwt({ secret })(c, next)
	}

	await next()
}
