import { Context } from 'hono'
import { AuthMiddleware, checkPath } from './auth'
import { vi } from 'vitest'
import { SecureEndpoint } from './secure-endpoints'
import { AuthException } from './common'
import { createContext, modifyContext } from '../testutil'
import { Bindings } from '../bindings'

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
		authTypes: ['admin'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/admin(\/.*)?$/,
	},
	{
		authTypes: ['player', 'admin'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/player-admin(\/.*)?$/,
	},
	{
		authTypes: ['gm', 'admin'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm-admin(\/.*)?$/,
	},
	{
		authTypes: ['gm', 'player'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm-player(\/.*)?$/,
	},
	{
		authTypes: ['gm', 'player', 'admin'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		path: /\/gm-player-admin(\/.*)?$/,
	},
]

const mocks = vi.hoisted(() => {
	return {
		getSecureEndpoints: () => secureEndpoints,
		AdminAuth: vi.fn().mockImplementation(async () => {
			return true
		}),
		GMAuth: vi.fn().mockImplementation(async () => {
			return true
		}),
		PlayerAuth: vi.fn().mockImplementation(async () => {
			return true
		}),
	}
})

// Mock secure endpoints
vi.mock('./secure-endpoints', () => {
	return {
		getSecureEndpoints: mocks.getSecureEndpoints,
	}
})

vi.mock('./admin', () => {
	return {
		AdminAuth: mocks.AdminAuth,
	}
})

vi.mock('./gm', () => {
	return {
		GMAuth: mocks.GMAuth,
	}
})

vi.mock('./player', () => {
	return {
		PlayerAuth: mocks.PlayerAuth,
	}
})

afterEach(() => {
	// Clear mock data
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
	let context: Context<{ Bindings: Bindings }>
	beforeEach(() => {
		context = createContext({
			req: {
				header: () => 'test-player',
				path: '/this-is-a-nonexistent-path',
				method: 'GET',
				param: () => {
					return { room: 'test-room', name: 'test-player' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('non-matching path returns successfully', async () => {
		let nextCalled = false
		await AuthMiddleware(
			{
				env: {
					ASSASSIN_SECRET: 'env-test-secret',
					OPENID: {
						get: async () => undefined,
					},
				},
				req: {
					path: '/this-is-a-nonexistent-path',
					method: 'GET',
				},
			} as unknown as Context<{ Bindings: Bindings }>,
			async () => {
				nextCalled = true
			}
		)
		expect(nextCalled).toBeTruthy()
		expect(mocks.AdminAuth).toHaveBeenCalledTimes(0)
		expect(mocks.GMAuth).toHaveBeenCalledTimes(0)
		expect(mocks.PlayerAuth).toHaveBeenCalledTimes(0)
	})

	describe('gm-player', () => {
		beforeEach(() => {
			modifyContext(context, '$.req.path', '/gm-player')
		})

		test('auth uses gm if successful', async () => {
			let nextCalled = false

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalledTimes(0)
			expect(mocks.GMAuth).toHaveBeenCalled()
			expect(mocks.PlayerAuth).toHaveBeenCalledTimes(0)
		})

		test('auth falls back to player if gm fails', async () => {
			let nextCalled = false

			mocks.GMAuth.mockImplementationOnce(async () => {
				return false
			})

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalledTimes(0)
			expect(mocks.GMAuth).toHaveBeenCalled()
			expect(mocks.PlayerAuth).toHaveBeenCalled()
		})

		test('auth fails if gm and player fails', async () => {
			let nextCalled = false

			mocks.PlayerAuth.mockImplementationOnce(async () => {
				return false
			})
			mocks.GMAuth.mockImplementationOnce(async () => {
				return false
			})

			expect(() =>
				AuthMiddleware(context, async () => {
					nextCalled = true
				})
			).rejects.toEqual(new AuthException('Unauthorized', 401))

			expect(nextCalled).toBeFalsy()
		})
	})

	describe('gm-admin', () => {
		beforeEach(() => {
			modifyContext(context, '$.req.path', '/gm-admin')
		})

		test('auth uses gm if successful', async () => {
			let nextCalled = false

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalledTimes(0)
			expect(mocks.GMAuth).toHaveBeenCalled()
			expect(mocks.PlayerAuth).toHaveBeenCalledTimes(0)
		})

		test('auth falls back to admin if gm fails', async () => {
			let nextCalled = false

			mocks.GMAuth.mockImplementationOnce(async () => {
				return false
			})

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalled()
			expect(mocks.GMAuth).toHaveBeenCalled()
			expect(mocks.PlayerAuth).toHaveBeenCalledTimes(0)
		})

		test('auth fails if gm and admin fails', async () => {
			let nextCalled = false

			mocks.AdminAuth.mockImplementationOnce(async () => {
				return false
			})
			mocks.GMAuth.mockImplementationOnce(async () => {
				return false
			})

			expect(() =>
				AuthMiddleware(context, async () => {
					nextCalled = true
				})
			).rejects.toEqual(new AuthException('Unauthorized', 401))

			expect(nextCalled).toBeFalsy()
		})
	})

	describe('player-admin', () => {
		beforeEach(() => {
			modifyContext(context, '$.req.path', '/player-admin')
		})

		test('auth uses player if successful', async () => {
			let nextCalled = false

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalledTimes(0)
			expect(mocks.GMAuth).toHaveBeenCalledTimes(0)
			expect(mocks.PlayerAuth).toHaveBeenCalled()
		})

		test('auth falls back to admin if player fails', async () => {
			let nextCalled = false

			mocks.PlayerAuth.mockImplementationOnce(async () => {
				return false
			})

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalled()
			expect(mocks.GMAuth).toHaveBeenCalledTimes(0)
			expect(mocks.PlayerAuth).toHaveBeenCalled()
		})

		test('auth fails if player and admin fails', async () => {
			let nextCalled = false

			mocks.AdminAuth.mockImplementationOnce(async () => {
				return false
			})
			mocks.PlayerAuth.mockImplementationOnce(async () => {
				return false
			})

			expect(() =>
				AuthMiddleware(context, async () => {
					nextCalled = true
				})
			).rejects.toEqual(new AuthException('Unauthorized', 401))

			expect(nextCalled).toBeFalsy()
		})
	})

	describe('gm-player-admin', () => {
		beforeEach(() => {
			modifyContext(context, '$.req.path', '/gm-player-admin')
		})

		test('auth uses gm if successful', async () => {
			let nextCalled = false

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalledTimes(0)
			expect(mocks.GMAuth).toHaveBeenCalled()
			expect(mocks.PlayerAuth).toHaveBeenCalledTimes(0)
		})

		test('auth falls back to player if gm fails', async () => {
			let nextCalled = false

			mocks.GMAuth.mockImplementationOnce(async () => {
				return false
			})

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalledTimes(0)
			expect(mocks.GMAuth).toHaveBeenCalled()
			expect(mocks.PlayerAuth).toHaveBeenCalled()
		})

		test('auth falls back to admin if gm and player fails', async () => {
			let nextCalled = false

			mocks.GMAuth.mockImplementationOnce(async () => {
				return false
			})
			mocks.PlayerAuth.mockImplementationOnce(async () => {
				return false
			})

			await AuthMiddleware(context, async () => {
				nextCalled = true
			})

			expect(nextCalled).toBeTruthy()
			expect(mocks.AdminAuth).toHaveBeenCalled()
			expect(mocks.GMAuth).toHaveBeenCalled()
			expect(mocks.PlayerAuth).toHaveBeenCalled()
		})

		test('auth fails if gm, player and admin fails', async () => {
			let nextCalled = false

			mocks.AdminAuth.mockImplementationOnce(async () => {
				return false
			})
			mocks.GMAuth.mockImplementationOnce(async () => {
				return false
			})
			mocks.PlayerAuth.mockImplementationOnce(async () => {
				return false
			})

			expect(() =>
				AuthMiddleware(context, async () => {
					nextCalled = true
				})
			).rejects.toEqual(new AuthException('Unauthorized', 401))

			expect(nextCalled).toBeFalsy()
		})
	})
})
