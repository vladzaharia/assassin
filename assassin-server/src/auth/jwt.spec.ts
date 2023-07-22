import { Context } from 'hono'
import { getToken, verifyToken } from './jwt'
import { AuthException } from './common'
import { SignJWT } from 'jose'
import { JWTClaims } from '../types'
import { createContext, modifyContext } from '../testutil'

let context: Context<{ Bindings }>

beforeEach(() => {
	context = createContext({
		req: {
			header: () => 'Bearer some-jwt-goes-here',
		},
	} as unknown as Context<{ Bindings }>)
})

describe('getToken', () => {
	test('extracts token from header', () => {
		const token = getToken(context)
		expect(token).toEqual('some-jwt-goes-here')
	})

	test("header with malformed 'Bearer' fails", () => {
		modifyContext(context, "$.req.header", () => "Bear some-jwt-goes-here")
		expect(() => getToken(context)).toThrowError(new AuthException('Malformed Authorization header', 400))
	})

	test("header with missing 'Bearer' fails", () => {
		modifyContext(context, "$.req.header", () => "some-jwt-goes-here")
		expect(() => getToken(context)).toThrowError(new AuthException('Malformed Authorization header', 400))
	})
})

describe('verifyToken', () => {
	test('token verified with KV secret', async () => {
		const token = await new SignJWT({ assassin: { admin: true, user: true } })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('kv-test-secret'))

		const verifiedToken = await verifyToken(context, token)

		expect(verifiedToken).toBeDefined()
		expect((verifiedToken.payload as unknown as JWTClaims).assassin.admin).toBeTruthy()
	})

	test('token verified with env secret', async () => {
		context.env.OPENID.get = () => undefined
		const token = await new SignJWT({ assassin: { admin: true, user: true } })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('env-test-secret'))

		const verifiedToken = await verifyToken(context, token)

		expect(verifiedToken).toBeDefined()
		expect((verifiedToken.payload as unknown as JWTClaims).assassin.admin).toBeTruthy()
	})

	test('token verification fails if no secret is available', async () => {
		context.env.OPENID.get = () => undefined
		context.env.ASSASSIN_SECRET = undefined

		expect(() => verifyToken(context, '')).rejects.toEqual(new AuthException('Could not find secret', 401))
	})

	test('token verification fails if secrets differ', async () => {
		const token = await new SignJWT({ assassin: { admin: true, user: true } })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('env-test-secret'))

		expect(() => verifyToken(context, token)).rejects.toEqual(new AuthException('Token could not be decoded', 401))
	})
})
