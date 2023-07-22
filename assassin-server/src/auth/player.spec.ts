import { Context } from 'hono'
import { PlayerAuth } from './player'
import { SignJWT } from 'jose'
import { createContext, modifyContext } from '../testutil'

let context: Context<{ Bindings }>

beforeEach(() => {
	context = createContext({
		req: {
			header: () => 'test-player',
			param: () => {
				return { name: 'test-player' }
			},
		},
	} as unknown as Context<{ Bindings }>)
})

describe('PlayerAuth', () => {
	test('auth is successful', async () => {
		const result = await PlayerAuth(context)
		expect(result).toBeTruthy()
	})

	test('auth is unsuccessful if on a different player', async () => {
		modifyContext(context, "$.req.header", (key) => key === "X-Assassin-User" ? `Vlad` : undefined)

		const result = await PlayerAuth(context)
		expect(result).toBeFalsy()
	})

	test('auth uses JWT if normal user header is not defined', async () => {
		const token = await new SignJWT({ assassin: { admin: false, user: true }, first_name: "test-player" })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('kv-test-secret'))

		modifyContext(context, "$.req.header", (key) => key === "Authorization" ? `Bearer ${token}` : undefined)

		const result = await PlayerAuth(context)
		expect(result).toBeTruthy()
	})

	test('auth is unsuccessful if on a different player, using JWT', async () => {
		const token = await new SignJWT({ assassin: { admin: false, user: true }, first_name: "Vlad" })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('kv-test-secret'))

		modifyContext(context, "$.req.header", (key) => key === "Authorization" ? `Bearer ${token}` : undefined)

		const result = await PlayerAuth(context)
		expect(result).toBeFalsy()
	})
})
