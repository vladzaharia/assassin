import { Context } from 'hono'
import { Bindings } from '../bindings'
import { getToken, verifyToken } from './jwt'
import { JWTClaims } from '../types'

export const PlayerAuth = async (c: Context<{ Bindings: Bindings }>) => {
	const { name: nameParam } = c.req.param()
	const nameHeader = c.req.header('X-Assassin-User')

	let name: string | undefined = nameHeader

	if (!nameHeader) {
		const verifiedToken = await verifyToken(c, getToken(c))
		name = ((await verifiedToken).payload as unknown as JWTClaims)?.first_name
	}

	console.log(`Player Auth: ${name}, param = ${nameParam}`)
	return nameParam === name
}
