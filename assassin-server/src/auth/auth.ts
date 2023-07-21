import { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'

import { Bindings } from '../bindings'
import { findRoomGM } from '../tables/player'
import { findRoom } from '../tables/room'
import { getSecureEndpoints, HTTPMethods } from './secure-endpoints'

export const checkPath = (path: string, method: string, endpoints = getSecureEndpoints()) => {
	for (const secureEndpoint of endpoints) {
		if (path.match(secureEndpoint.path) && secureEndpoint.methods.includes(method as HTTPMethods)) {
			console.info(`${method} ${path} matched against ${secureEndpoint.path} / ${secureEndpoint.methods}`)
			return secureEndpoint
		}
	}
}

export class HTTPException extends Error {
	readonly res?: Response
	constructor(message: string, res: Response) {
		super(message)
		this.res = res
	}
	getResponse(): Response {
		if (this.res) {
			return this.res
		}
		return new Response(this.message, {
			status: 500,
		})
	}
}

export const AuthMiddleware = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
	const secret = (await c.env.OPENID.get('secret')) || c.env.ASSASSIN_SECRET
	const match = checkPath(c.req.path, c.req.method)

	if (match) {
		if (match.authTypes.includes('gm') || match.authTypes.includes('player')) {
			const { room, name: nameParam } = c.req.param()
			const name = c.req.header('X-Assassin-User')

			const roomRecord = await findRoom(c.env.D1DATABASE, room)
			if (!roomRecord) {
				console.log('Room not found')
				const res = new Response('Room not found!', {
					status: 404,
				})
				throw new HTTPException('Room not found!', res)
			}
			console.log(`Room found; ${roomRecord}`)
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
				console.log(`JWT Auth`)
				if (!secret) {
					console.warn('No JWT token defined!')
				}
				return jwt({ secret })(c, next)
			} else if (!result) {
				const res = new Response('Unauthorized', {
					status: 401,
				})
				throw new HTTPException('Unauthorized', res)
			}
		} else if (match.authTypes.includes('jwt')) {
			console.log(`JWT Auth`)
			if (!secret) {
				console.warn('No JWT token defined!')
			}
			return jwt({ secret })(c, next)
		}
	}

	await next()
}
