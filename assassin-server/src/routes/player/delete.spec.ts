import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { DeletePlayer } from './delete'
import { createContext } from '../../testutil'
import { vi } from 'vitest'
import { PlayerTable, RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		deletePlayer: vi.fn(),
		setGMStatus: vi.fn(),
		findPlayer: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 0,
				status: 'alive',
			} as PlayerTable
		}),
		listPlayersInRoom: vi.fn().mockImplementation(async () => {
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
					status: 'alive',
				},
			] as PlayerTable[]
		}),
		findRoom: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				status: 'not-ready',
				numWords: 0,
				usesWords: 0,
				wordlists: JSON.stringify([]),
			} as RoomTable
		}),
	}
})

vi.mock('../../tables/player', () => {
	return {
		listPlayersInRoom: mocks.listPlayersInRoom,
		findPlayer: mocks.findPlayer,
		deletePlayer: mocks.deletePlayer,
		setGMStatus: mocks.setGMStatus,
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

describe('DeletePlayer', () => {
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

	test('calls deletePlayer', async () => {
		const result = await DeletePlayer(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully left test-room room!')
		expect(mocks.deletePlayer).toBeCalledTimes(1)
		expect(mocks.deletePlayer).toBeCalledWith(undefined, 'test-room', 'test-player')
	})

	describe('reassign GM', () => {
		test('reassigns GM if available', async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 1,
					status: 'alive',
				} as PlayerTable
			})

			const result = await DeletePlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.setGMStatus).toBeCalledTimes(1)
			expect(mocks.setGMStatus).toBeCalledWith(undefined, 'test-room', 'test-player-2', true)
		})

		test('does not reassign if nobody else in the room', async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 1,
					status: 'alive',
				} as PlayerTable
			})

			mocks.listPlayersInRoom.mockImplementation(async () => {
				return [
					{
						name: 'test-player',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
				] as PlayerTable[]
			})

			const result = await DeletePlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.setGMStatus).toBeCalledTimes(0)
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await DeletePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return undefined
			})

			const result = await DeletePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})

		test('player not found', async () => {
			mocks.findPlayer.mockImplementationOnce(() => {
				return undefined
			})

			const result = await DeletePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Player not found!')
		})

		test('game already started', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'started',
					numWords: 0,
					usesWords: 0,
					wordlists: JSON.stringify([]),
				} as RoomTable
			})

			const result = await DeletePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Game has already started!')
		})
	})
})
