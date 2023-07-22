import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { GetPlayer } from './get'
import { createContext } from '../../testutil'
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

	test('gets player information', async () => {
		const result = await GetPlayer(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.name).toEqual('test-player')
		expect(resultJson.room).toEqual('test-room')
		expect(resultJson.isGM).toBeTruthy()
		expect(resultJson.status).toEqual('alive')
		expect(resultJson.target).toEqual('test-player-2')
		expect(resultJson.words.length).toEqual(3)
		expect(resultJson.words).toEqual(['test', 'words', 'here'])
	})

	test('not a GM', async () => {
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

	test('has no target', async () => {
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

	test('empty words list', async () => {
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

	test('has no words', async () => {
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
