import { Context } from 'hono'
import { Bindings } from '../bindings'
import { getToken, verifyToken } from './jwt'
import { JWTClaims } from '../types'

export const AdminAuth = async (c: Context<{ Bindings: Bindings }>) => {
	const verifiedToken = await verifyToken(c, getToken(c))

	console.log('Admin auth w/ JWT')
	return ((await verifiedToken).payload as unknown as JWTClaims)?.assassin?.admin
}
