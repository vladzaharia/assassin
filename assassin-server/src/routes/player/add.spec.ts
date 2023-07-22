import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { AddPlayer } from './add'
import { createContext } from '../../testutil'
import { vi } from 'vitest'
import { PlayerTable, RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		listPlayersInRoom: vi.fn().mockImplementation(async () => {
			return [
				{
					name: 'test-player-2',
					room: 'test-room',
					isGM: 1,
					status: 'alive',
				},
			] as PlayerTable[]
		}),
		insertPlayer: vi.fn(),
		findRoom: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				status: 'not-ready',
				numWords: 0,
				usesWords: 0,
				wordlists: '[]',
			} as RoomTable
		}),
	}
})

vi.mock('../../tables/player', () => {
	return {
		listPlayersInRoom: mocks.listPlayersInRoom,
		insertPlayer: mocks.insertPlayer,
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

describe('AddPlayer', () => {
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

	test('calls insertPlayer', async () => {
		const result = await AddPlayer(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully joined test-room room!')
		expect(mocks.insertPlayer).toBeCalledTimes(1)
		expect(mocks.insertPlayer).toBeCalledWith(undefined, 'test-room', 'test-player', false)
	})

	test('assigns GM if no players in room', async () => {
		mocks.listPlayersInRoom.mockImplementationOnce(() => {
			return []
		})

		const result = await AddPlayer(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully joined test-room room!')
		expect(mocks.insertPlayer).toBeCalledTimes(1)
		expect(mocks.insertPlayer).toBeCalledWith(undefined, 'test-room', 'test-player', true)
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await AddPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return undefined
			})

			const result = await AddPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})

		test('player already in room', async () => {
			mocks.listPlayersInRoom.mockImplementationOnce(() => {
				return [
					{
						name: 'test-player',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
				] as PlayerTable[]
			})

			const result = await AddPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Player already exists!')
		})

		test('game already started', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'started',
					numWords: 0,
					usesWords: 0,
					wordlists: '[]',
				} as RoomTable
			})

			const result = await AddPlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Game has already started!')
		})
	})
})
