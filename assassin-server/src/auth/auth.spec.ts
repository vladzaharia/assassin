import { Context } from 'hono'
import { AuthMiddleware, checkPath } from './auth'
import { vi } from 'vitest'
import { SecureEndpoint } from './secure-endpoints'
import { jwt } from 'hono/jwt'
import { PlayerTable, RoomTable } from '../tables/db'

const secureEndpoints: SecureEndpoint[] = [
	{
		authTypes: ['gm'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm(\/.*)?$/,
	},
	{
		authTypes: ['gm'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm\/2$/,
	},
	{
		authTypes: ['gm'],
		methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm-no-get(\/.*)?$/,
	},
	{
		authTypes: ['player'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/player(\/.*)?$/,
	},
	{
		authTypes: ['jwt'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/jwt(\/.*)?$/,
	},
	{
		authTypes: ['player', 'jwt'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/player-jwt(\/.*)?$/,
	},
	{
		authTypes: ['gm', 'jwt'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm-jwt(\/.*)?$/,
	},
	{
		authTypes: ['player', 'gm'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/player-gm(\/.*)?$/,
	},
	{
		authTypes: ['gm', 'player', 'jwt'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm-player-jwt(\/.*)?$/,
	},
]

// Mock secure endpoints
vi.mock('./secure-endpoints', () => {
	return {
		getSecureEndpoints: () => secureEndpoints,
	}
})

const mocks = vi.hoisted(() => {
	return {
		jwt: vi.fn().mockImplementation(() => () => {
			return
		}),
		findRoomMock: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				numWords: 0,
				status: 'started',
				usesWords: 0,
				wordlists: '[]',
			} as RoomTable
		}),
		findRoomGM: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 1,
				status: 'alive',
			} as PlayerTable
		}),
	}
})

vi.mock('hono/jwt', () => {
	return {
		jwt: mocks.jwt,
	}
})

vi.mock('../tables/player', () => {
	return {
		findRoomGM: mocks.findRoomGM,
	}
})

vi.mock('../tables/room', () => {
	return {
		findRoom: mocks.findRoomMock,
	}
})

afterEach(() => {
	vi.clearAllMocks()
})

describe('checkPath', () => {
	test('returns endpoint if found', () => {
		const result = checkPath('/gm', 'GET')
		expect(result).toBe(secureEndpoints[0])
	})

	test('returns first matched endpoint if found', () => {
		const result = checkPath('/gm/2', 'GET')
		expect(result).toBe(secureEndpoints[0])
	})

	test('returns undefined if not found', () => {
		const result = checkPath('/not-found', 'GET')
		expect(result).toBeUndefined()
	})

	test('returns undefined if method does not match', () => {
		const result = checkPath('/gm-no-get', 'GET')
		expect(result).toBeUndefined()
	})
})

describe('AuthMiddleware', () => {
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
				path: '/this-is-a-nonexistent-path',
				method: 'GET',
				param: () => {
					return { room: 'test-room', name: 'test-player' }
				},
			},
		} as unknown as Context<{ Bindings }>
	})

	test('non-matching path returns successfully', async () => {
		let nextCalled = false
		await AuthMiddleware(
			{
				env: {
					ASSASSIN_SECRET: 'some-test-secret',
					OPENID: {
						get: async () => undefined,
					},
				},
				req: {
					path: '/this-is-a-nonexistent-path',
					method: 'GET',
				},
			} as unknown as Context<{ Bindings }>,
			async () => {
				nextCalled = true
			}
		)
		expect(nextCalled).toBeTruthy()
		expect(jwt).toHaveBeenCalledTimes(0)
	})

	describe('jwt', () => {
		test('jwt-only auth gets secret from env', async () => {
			context.req.path = '/jwt'

			await AuthMiddleware(context, async () => {
				return
			})
			expect(jwt).toHaveBeenCalled()
			expect(jwt).toHaveBeenCalledWith({ secret: 'some-test-secret' })
		})

		test('jwt-only auth gets secret from KV', async () => {
			context.req.path = '/jwt'
			context.env.ASSASSIN_SECRET = undefined
			context.env.OPENID.get = async () => 'another-test-secret'

			await AuthMiddleware(context, async () => {
				return
			})
			expect(jwt).toHaveBeenCalled()
			expect(jwt).toHaveBeenCalledWith({ secret: 'another-test-secret' })
		})

		test('jwt-only auth with no secrets', async () => {
			context.req.path = '/jwt'
			context.env.ASSASSIN_SECRET = undefined
			context.env.OPENID.get = async () => undefined

			await AuthMiddleware(context, async () => {
				return
			})
			expect(jwt).toHaveBeenCalled()
			expect(jwt).toHaveBeenCalledWith({ secret: undefined })
		})
	})

	describe('player', () => {
		test('player-only auth is successful', async () => {
			let nextCalled = false
			context.req.path = '/player'

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})

		test('player-only auth is unsuccessful if on a different player', async () => {
			let nextCalled = false
			context.req.path = '/player'
			context.req.header = () => 'Vlad'

			const response = async () =>
				await AuthMiddleware(context, async () => {
					nextCalled = true
				})

			expect(response).rejects.toThrowError('Unauthorized')

			expect(nextCalled).toBeFalsy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})

		test('player-only auth is unsuccessful if room not found', async () => {
			let nextCalled = false
			context.req.path = '/player'

			mocks.findRoomMock.mockImplementationOnce(() => undefined)

			const response = async () =>
				await AuthMiddleware(context, async () => {
					nextCalled = true
				})

			expect(response).rejects.toThrowError('Room not found!')

			expect(nextCalled).toBeFalsy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})
	})

	describe('gm', () => {
		test('gm-only auth is successful', async () => {
			let nextCalled = false
			context.req.path = '/gm'

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})

		test('gm-only auth is unsuccessful if on a different player', async () => {
			let nextCalled = false
			context.req.path = '/gm'
			context.req.header = () => 'Vlad'

			const response = async () =>
				await AuthMiddleware(context, async () => {
					nextCalled = true
				})

			expect(response).rejects.toThrowError('Unauthorized')

			expect(nextCalled).toBeFalsy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})
	})

	describe('gm-jwt]', () => {
		test('gm-jwt auth uses gm if successful', async () => {
			let nextCalled = false
			context.req.path = '/gm-jwt'

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})

		test('gm-jwt auth falls back to jwt if gm fails', async () => {
			let nextCalled = false
			context.req.path = '/gm-jwt'
			context.req.header = () => 'Vlad'

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeFalsy()
			expect(jwt).toHaveBeenCalled()
		})

		test('gm-jwt auth with no secrets', async () => {
			context.req.path = '/jwt'
			context.env.ASSASSIN_SECRET = undefined
			context.env.OPENID.get = async () => undefined
			let nextCalled = false
			context.req.path = '/gm-jwt'
			context.req.header = () => 'Vlad'

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})
			expect(nextCalled).toBeFalsy()
			expect(jwt).toHaveBeenCalled()
			expect(jwt).toHaveBeenCalledWith({ secret: undefined })
		})
	})

	describe('player-jwt]', () => {
		test('player-jwt auth uses player if successful', async () => {
			let nextCalled = false
			context.req.path = '/player-jwt'

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})

		test('player-jwt auth falls back to jwt if player fails', async () => {
			let nextCalled = false
			context.req.path = '/player-jwt'
			context.req.header = () => 'Vlad'

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeFalsy()
			expect(jwt).toHaveBeenCalled()
		})
	})

	describe('gm-player-jwt]', () => {
		test('gm-player-jwt auth uses gm if successful', async () => {
			let nextCalled = false
			context.req.path = '/gm-player-jwt'
			context.req.param = () => {
				return { room: 'test-room', name: 'test-player2' }
			}

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})

		test('player-jwt auth falls back to player if gm fails', async () => {
			let nextCalled = false
			context.req.path = '/player-jwt'
			context.req.header = () => 'test-player2'
			context.req.param = () => {
				return { room: 'test-room', name: 'test-player2' }
			}

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(jwt).toHaveBeenCalledTimes(0)
		})

		test('player-jwt auth falls back to jwt if gm and player fail', async () => {
			let nextCalled = false
			context.req.path = '/player-jwt'
			context.req.header = () => 'Vlad'
			context.req.param = () => {
				return { room: 'test-room', name: 'test-player2' }
			}

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeFalsy()
			expect(jwt).toHaveBeenCalled()
		})
	})
})
