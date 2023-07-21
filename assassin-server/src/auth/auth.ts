import { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'

import { Bindings } from '../bindings'
import { getSecureEndpoints, HTTPMethods } from './secure-endpoints'
import { PlayerAuth } from './player'
import { GMAuth } from './gm'
import { AuthException } from './common'

export const checkPath = (path: string, method: string, endpoints = getSecureEndpoints()) => {
	for (const secureEndpoint of endpoints) {
		if (path.match(secureEndpoint.path) && secureEndpoint.methods.includes(method as HTTPMethods)) {
			console.info(`${method} ${path} matched against ${secureEndpoint.path} / ${secureEndpoint.methods}`)
			return secureEndpoint
		}
	}
}

export const AuthMiddleware = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
	const secret = (await c.env.OPENID.get('secret')) || c.env.ASSASSIN_SECRET
	const match = checkPath(c.req.path, c.req.method)

	if (match) {
		let result = false

		if (match.authTypes.includes('gm')) {
			result = await GMAuth(c)
		}

		if (match.authTypes.includes('player') && !result) {
			result = await PlayerAuth(c)
		}

		if (match.authTypes.includes('jwt') && !result) {
			console.log(`JWT Auth`)
			if (!secret) {
				console.warn('No JWT token defined!')
			}
			return jwt({ secret })(c, next)
		}

		if (!result) {
			console.error("No auth was successful!")
			throw new AuthException("Unauthorized", 401)
		}
	}

	console.log("Auth successful!")
	await next()
}
