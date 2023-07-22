import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { GetRoom } from './get'
import { createContext } from '../../testutil'
import { vi } from 'vitest'
import { PlayerTable, RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		listPlayersInRoom: vi.fn().mockImplementation(async () => {
			return [
				{
					name: 'test-player',
					room: 'test-room',
					isGM: 1,
					status: 'alive',
					target: 'test-player-2',
					words: JSON.stringify(['test', 'words', 'here']),
				},
			] as PlayerTable[]
		}),
		findRoom: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				status: 'not-ready',
				numWords: 3,
				usesWords: 1,
				wordlists: JSON.stringify(['a-wordlist', 'another-wordlist']),
			} as RoomTable
		}),
	}
})

vi.mock('../../tables/player', () => {
	return {
		listPlayersInRoom: mocks.listPlayersInRoom,
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

describe('GetRoom', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { room: 'test-room' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	describe('name', () => {
		test('has name', async () => {
			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.name).toEqual('test-room')
		})
	})

	describe('status', () => {
		test('not-ready', async () => {
			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.status).toEqual('not-ready')
		})

		test('ready', async () => {
			mocks.listPlayersInRoom.mockImplementationOnce(async () => {
				return [
					{
						name: 'test-player',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
					{
						name: 'test-player-2',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
					{
						name: 'test-player-3',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
				] as PlayerTable[]
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.status).toEqual('ready')
			expect(resultJson.players.length).toEqual(3)
		})

		test('started', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'started',
					numWords: 0,
					usesWords: 0,
				} as RoomTable
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.status).toEqual('started')
		})

		test('completed', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'completed',
					numWords: 0,
					usesWords: 0,
				} as RoomTable
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.status).toEqual('completed')
		})
	})

	describe('players', () => {
		test('has players', async () => {
			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.players.length).toEqual(1)
			expect(resultJson.players).toEqual([{ name: 'test-player', isGM: true, status: 'alive' }])
		})

		test('has many players', async () => {
			mocks.listPlayersInRoom.mockImplementationOnce(async () => {
				return [
					{
						name: 'test-player',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
					{
						name: 'test-player-2',
						room: 'test-room',
						isGM: 0,
						status: 'champion',
					},
					{
						name: 'test-player-3',
						room: 'test-room',
						isGM: 0,
						status: 'eliminated',
					},
				] as PlayerTable[]
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.players.length).toEqual(3)
			expect(resultJson.players[0]).toEqual({ name: 'test-player', isGM: true, status: 'alive' })
			expect(resultJson.players[1]).toEqual({ name: 'test-player-2', isGM: false, status: 'champion' })
			expect(resultJson.players[2]).toEqual({ name: 'test-player-3', isGM: false, status: 'eliminated' })
		})

		test('has no players', async () => {
			mocks.listPlayersInRoom.mockImplementationOnce(async () => [])

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.players.length).toEqual(0)
			expect(resultJson.players).toEqual([])
		})
	})

	describe('usesWords', () => {
		test('true', async () => {
			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.usesWords).toBeTruthy()
		})

		test('false', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'completed',
					numWords: 0,
					usesWords: 0,
				} as RoomTable
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.usesWords).toBeFalsy()
		})
	})

	describe('numWords', () => {
		test('3', async () => {
			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.numWords).toEqual(3)
		})

		test('0', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'completed',
					numWords: 0,
					usesWords: 0,
				} as RoomTable
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.numWords).toEqual(0)
		})
	})

	describe('wordLists', () => {
		test('has wordlists', async () => {
			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.wordLists.length).toEqual(2)
			expect(resultJson.wordLists).toEqual(['a-wordlist', 'another-wordlist'])
		})

		test('has empty wordlists', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'completed',
					numWords: 0,
					usesWords: 0,
					wordlists: JSON.stringify([]),
				} as RoomTable
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.wordLists.length).toEqual(0)
			expect(resultJson.wordLists).toEqual([])
		})

		test('has no wordlists', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'completed',
					numWords: 0,
					usesWords: 0,
				} as RoomTable
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.wordLists.length).toEqual(0)
			expect(resultJson.wordLists).toEqual([])
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return undefined
			})

			const result = await GetRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})
	})
})
