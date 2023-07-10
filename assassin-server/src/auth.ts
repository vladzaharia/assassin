import { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'

import { Bindings } from './bindings'
import { findRoomGM } from './tables/player'
import { findRoom } from './tables/room'

type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export const SECURE_ENDPOINTS: { path: RegExp; methods: HTTPMethods[]; useGMAuth?: boolean }[] = [
	{
		path: /debug.*$/,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	},
	{
		path: /room\/\w*$/,
		methods: ['PUT', 'DELETE'],
	},
	{
		path: /room\/\w*\/(start|reset)$/,
		methods: ['POST'],
		useGMAuth: true,
	},
	{
		path: /room\/\w*\/gm\/?(\w+)?$/,
		methods: ['POST'],
		useGMAuth: true,
	},
	{
		path: /wordlist\/\w*$/,
		methods: ['PUT', 'DELETE'],
	},
	{
		path: /wordlist\/\w*\/words$/,
		methods: ['PUT', 'DELETE'],
	},
]

export const checkPath = (path: string, method: string) => {
	for (const secureEndpoint of SECURE_ENDPOINTS) {
		if (path.match(secureEndpoint.path) && secureEndpoint.methods.includes(method as HTTPMethods)) {
			console.info(`${method} ${path} matched against ${secureEndpoint.path} / ${secureEndpoint.methods}`)
			return secureEndpoint
		}
	}
}

export const AuthMiddleware = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
	const secret = (await c.env.OPENID.get('secret')) || 'test-secret'
	const match = checkPath(c.req.path, c.req.method)
	if (match) {
		if (match.useGMAuth) {
			const { room } = c.req.param()
			const name = c.req.header('X-Assassin-User')

			const roomRecord = await findRoom(c.env.D1DATABASE, room)

			if (!roomRecord) {
				return c.json({ message: 'Room not found!' }, 404)
			}

			const roomGM = await findRoomGM(c.env.D1DATABASE, room)

			console.log(`GM Auth: ${name}, gm = ${roomGM?.name}, headers=${JSON.stringify(c.req.headers)}`)

			if (roomGM?.name !== name) {
				return jwt({ secret })(c, next)
			}
		} else {
			return jwt({ secret })(c, next)
		}
	}

	await next()
}
