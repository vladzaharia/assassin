import { Context } from 'hono'
import { AuthException } from './common'
import { SignJWT } from 'jose'
import { AdminAuth } from './admin'

let context: Context<{ Bindings }>

beforeEach(() => {
	context = {
		env: {
			ASSASSIN_SECRET: 'env-test-secret',
			OPENID: {
				get: async () => 'kv-test-secret',
			},
		},
		req: {
			header: () => 'Bearer some-jwt-goes-here',
			param: () => {
				return { room: 'test-room', name: 'test-player' }
			},
		},
	} as unknown as Context<{ Bindings }>
})

describe('AdminAuth', () => {
	test('valid admin token', async () => {
		const token = await new SignJWT({ assassin: { admin: true, user: true } })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('kv-test-secret'))
		context.req.header = () => `Bearer ${token}`

		const result = await AdminAuth(context)

		expect(result).toBeTruthy()
	})

	test('valid user token, no admin permission', async () => {
		const token = await new SignJWT({ assassin: { admin: false, user: true } })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('kv-test-secret'))
		context.req.header = () => `Bearer ${token}`

		const result = await AdminAuth(context)

		expect(result).toBeFalsy()
	})

	test('invalid token', async () => {
		expect(() => AdminAuth(context)).rejects.toEqual(new AuthException('Token could not be decoded', 401))
	})
})
