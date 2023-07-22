import { Context } from 'hono'
import { jwtVerify } from 'jose'
import { Bindings } from '../bindings'
import { AuthException } from './common'

export const getToken = (c: Context<{ Bindings: Bindings }>) => {
	const authorization = c.req.header('Authorization')
	const splitAuthorization = authorization?.split(' ')

	if (splitAuthorization && splitAuthorization.length > 1 && splitAuthorization[0] === 'Bearer') {
		return splitAuthorization[1]
	}

	throw new AuthException('Malformed Authorization header', 400)
}

export const verifyToken = async (c: Context<{ Bindings: Bindings }>, token: string) => {
	const secret = (await c.env.OPENID.get('secret')) || c.env.ASSASSIN_SECRET

	if (!secret) {
		throw new AuthException('Could not find secret', 401)
	}

	try {
		return await jwtVerify(token, new TextEncoder().encode(secret))
	} catch {
		throw new AuthException('Token could not be decoded', 401)
	}
}
