import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { GetPlayer } from './get'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { PlayerTable, RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		findPlayer: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 1,
				status: 'alive',
				target: 'test-player-2',
				words: JSON.stringify(['test', 'words', 'here']),
			} as PlayerTable
		}),
		findRoom: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				status: 'started',
				numWords: 3,
				usesWords: 1,
				wordlists: JSON.stringify([]),
			} as RoomTable
		}),
	}
})

vi.mock('../../tables/player', () => {
	return {
		findPlayer: mocks.findPlayer,
	}
})

vi.mock('../../tables/room', () => {
	return {
		findRoom: mocks.findRoom,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('GetPlayer', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { room: 'test-room', name: 'test-player' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	describe('findRoom', async () => {
		test('calls method', async () => {
			const result = await GetPlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room', name: 'test-player-3' }
			})

			const result = await GetPlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('findPlayer', async () => {
		test('calls method', async () => {
			const result = await GetPlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findPlayer).toBeCalledTimes(1)
			expect(mocks.findPlayer).toBeCalledWith(undefined, 'test-room', 'test-player')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room', name: 'test-player-3' }
			})

			const result = await GetPlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findPlayer).toBeCalledTimes(1)
			expect(mocks.findPlayer).toBeCalledWith(undefined, 'another-room', 'test-player-3')
		})
	})

	describe('name', () => {
		test('is set', async () => {
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.name).toEqual('test-player')
		})

		test('is based on db result', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'another-player',
					room: 'another-room',
					isGM: 0,
					status: 'eliminated',
					target: 'test-player-2',
					words: JSON.stringify(['other']),
				} as PlayerTable
			})
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.name).toEqual('another-player')
		})
	})

	describe('room', () => {
		test('is set', async () => {
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.room).toEqual('test-room')
		})

		test('is based on db result', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'another-player',
					room: 'another-room',
					isGM: 0,
					status: 'eliminated',
					target: 'test-player-2',
					words: JSON.stringify(['other']),
				} as PlayerTable
			})
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.room).toEqual('another-room')
		})
	})

	describe('status', () => {
		test('player is alive', async () => {
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.status).toEqual('alive')
		})

		test('player is eliminated', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'eliminated',
					target: 'test-player-2',
					words: JSON.stringify(['test', 'words', 'here']),
				} as PlayerTable
			})

			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.status).toEqual('eliminated')
		})

		test('player is champion', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'champion',
					target: 'test-player-2',
					words: JSON.stringify(['test', 'words', 'here']),
				} as PlayerTable
			})

			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.status).toEqual('champion')
		})
	})

	describe('isGM', () => {
		test('player is GM', async () => {
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.isGM).toBeTruthy()
		})

		test('player is not a GM', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player-2',
					words: JSON.stringify(['test', 'words', 'here']),
				} as PlayerTable
			})
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.isGM).toBeFalsy()
		})
	})

	describe('target', () => {
		test('player has target', async () => {
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.target).toEqual('test-player-2')
		})

		test('player has no target', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					words: JSON.stringify(['test', 'words', 'here']),
				} as PlayerTable
			})
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.target).toBeUndefined()
		})
	})

	describe('words', () => {
		test('player has words', async () => {
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.words.length).toEqual(3)
			expect(resultJson.words).toEqual(['test', 'words', 'here'])
		})

		test('player has empty words list', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player-2',
					words: JSON.stringify([]),
				} as PlayerTable
			})
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.words).toEqual([])
		})

		test('player has no words', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player-2',
				} as PlayerTable
			})
			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.words).toEqual([])
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return undefined
			})

			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})

		test('player not found', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return undefined
			})

			const result = await GetPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Player not found!')
		})
	})
})
