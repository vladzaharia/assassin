import { Context } from "hono"
import { PlayerAuth } from "./player"

let context: Context<{ Bindings }>

beforeEach(() => {
	context = {
		env: {
			ASSASSIN_SECRET: 'some-test-secret',
			OPENID: {
				get: async () => undefined,
			},
		},
		req: {
			header: () => 'test-player',
			path: '/player',
			method: 'GET',
			param: () => {
				return { room: 'test-room', name: 'test-player' }
			},
		},
	} as unknown as Context<{ Bindings }>
})

describe('PlayerAuth', () => {
	test('auth is successful', async () => {
		const result = await PlayerAuth(context)
		expect(result).toBeTruthy()
	})

	test('auth is unsuccessful if on a different player', async () => {
		context.req.header = () => 'Vlad'

		const result = await PlayerAuth(context)
		expect(result).toBeFalsy()
	})
})
