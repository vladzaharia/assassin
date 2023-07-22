import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { ListRooms } from './list'
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
				},
				{
					name: 'test-player-2',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
				},
			] as PlayerTable[]
		}),
		listRooms: vi.fn().mockImplementation(async () => {
			return [
				{
					name: 'test-room',
					status: 'not-ready',
					numWords: 0,
					usesWords: 0,
					wordlists: JSON.stringify([]),
				},
				{
					name: 'test-room-2',
					status: 'started',
					numWords: 3,
					usesWords: 1,
					wordlists: JSON.stringify(['some-list', 'another-list']),
				},
			] as RoomTable[]
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
		listRooms: mocks.listRooms,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('ListRooms', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext()
	})

	describe('room array', () => {
		test('multiple results', async () => {
			const result = await ListRooms(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.rooms.length).toEqual(2)
		})

		test('single result', async () => {
			mocks.listRooms.mockImplementationOnce(async () => {
				return [
					{
						name: 'test-room',
						status: 'not-ready',
						numWords: 0,
						usesWords: 0,
						wordlists: JSON.stringify([]),
					},
				] as RoomTable[]
			})
			const result = await ListRooms(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.rooms.length).toEqual(1)
		})
	})

	test('has name', async () => {
		const result = await ListRooms(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.rooms[0].name).toEqual('test-room')
		expect(resultJson.rooms[1].name).toEqual('test-room-2')
	})

	test('has status', async () => {
		const result = await ListRooms(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.rooms[0].status).toEqual('not-ready')
		expect(resultJson.rooms[1].status).toEqual('started')
	})

	test('has numPlayers', async () => {
		mocks.listPlayersInRoom.mockImplementationOnce(() => {
			return []
		})

		const result = await ListRooms(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.rooms[0].numPlayers).toEqual(0)
		expect(resultJson.rooms[1].numPlayers).toEqual(2)
	})

	test('has usesWords', async () => {
		const result = await ListRooms(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.rooms[0].usesWords).toEqual(false)
		expect(resultJson.rooms[1].usesWords).toEqual(true)
	})

	describe('numWordList', () => {
		test('has wordlist', async () => {
			const result = await ListRooms(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.rooms[1].numWordLists).toEqual(2)
		})

		test('empty wordlist', async () => {
			const result = await ListRooms(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.rooms[0].numWordLists).toEqual(0)
		})

		test('no wordlist', async () => {
			mocks.listRooms.mockImplementationOnce(async () => {
				return [
					{
						name: 'test-room',
						status: 'not-ready',
						numWords: 0,
						usesWords: 0,
					},
				] as RoomTable[]
			})

			const result = await ListRooms(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.rooms[0].numWordLists).toEqual(0)
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.listRooms.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await ListRooms(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})
	})
})
