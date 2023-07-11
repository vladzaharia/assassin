import { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'

import { Bindings } from './bindings'
import { findRoomGM } from './tables/player'
import { findRoom } from './tables/room'

type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'
type AuthType = 'gm' | 'player' | 'jwt'
export const SECURE_ENDPOINTS: { path: RegExp; methods: HTTPMethods[]; authTypes: AuthType[] }[] = [
	{
		path: /debug.*$/,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		authTypes: ['jwt'],
	},
	{
		path: /room\/\w*$/,
		methods: ['PUT', 'DELETE'],
		authTypes: ['jwt'],
	},
	{
		path: /room\/\w*\/player\/\w*$/,
		methods: ['GET', 'PUT', 'DELETE'],
		authTypes: ['player', 'jwt'],
	},
	{
		path: /room\/\w*\/player\/\w*\/eliminate$/,
		methods: ['POST'],
		authTypes: ['player', 'jwt'],
	},
	{
		path: /room\/\w*\/(start|reset)$/,
		methods: ['POST'],
		authTypes: ['gm', 'jwt'],
	},
	{
		path: /room\/\w*\/gm\/?(\w+)?$/,
		methods: ['POST'],
		authTypes: ['gm', 'jwt'],
	},
	{
		path: /wordlist\/\w*$/,
		methods: ['PUT', 'DELETE'],
		authTypes: ['jwt'],
	},
	{
		path: /wordlist\/\w*\/words$/,
		methods: ['PUT', 'DELETE'],
		authTypes: ['jwt'],
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
		if (match.authTypes.includes('gm') || match.authTypes.includes('player')) {
			const { room, name: nameParam } = c.req.param()
			const name = c.req.header('X-Assassin-User')

			const roomRecord = await findRoom(c.env.D1DATABASE, room)
			if (!roomRecord) {
				return c.json({ message: 'Room not found!' }, 404)
			}
			const roomGM = await findRoomGM(c.env.D1DATABASE, room)

			let result = false

			if (match.authTypes.includes('gm')) {
				console.log(`GM Auth: ${name}, gm = ${roomGM?.name}`)
				result = roomGM?.name === name
			}

			if (match.authTypes.includes('player') && !result) {
				console.log(`Player Auth: ${name}, param = ${nameParam}`)
				result = nameParam === name
			}

			if (!result && match.authTypes.includes('jwt')) {
				return jwt({ secret })(c, next)
			}
		} else if (match.authTypes.includes('jwt')) {
			return jwt({ secret })(c, next)
		}
	}

	await next()
}
