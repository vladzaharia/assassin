import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { StartGame } from './start'
import { createContext, modifyContext } from '../../testutil'
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
				{
					name: 'test-player-3',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
				},
			] as PlayerTable[]
		}),
		listWordsInWordLists: vi.fn().mockImplementation(async () => {
			return ['some', 'words', 'go', 'here', 'foo', 'bar', 'baz', 'we', 'need', 'at', 'least', 'nine']
		}),
		deletePlayer: vi.fn(),
		insertPlayer: vi.fn(),
		setTarget: vi.fn(),
		setWords: vi.fn(),
		setStatus: vi.fn(),
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
		deletePlayer: mocks.deletePlayer,
		insertPlayer: mocks.insertPlayer,
		setTarget: mocks.setTarget,
		setWords: mocks.setWords,
	}
})

vi.mock('../../tables/room', () => {
	return {
		findRoom: mocks.findRoom,
		setStatus: mocks.setStatus,
	}
})

vi.mock('../../tables/word', () => {
	return {
		listWordsInWordLists: mocks.listWordsInWordLists,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('StartGame', () => {
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

	test('returns 200 / success message', async () => {
		const result = await StartGame(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Game started successfully!')
	})

	describe('findRoom', async () => {
		test('calls method', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('listPlayersInRoom', async () => {
		test('calls method', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.listPlayersInRoom).toBeCalledTimes(1)
			expect(mocks.listPlayersInRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.listPlayersInRoom).toBeCalledTimes(1)
			expect(mocks.listPlayersInRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('setStatus', async () => {
		test('calls method', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setStatus).toBeCalledTimes(1)
			expect(mocks.setStatus).toBeCalledWith(undefined, 'test-room', 'started')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setStatus).toBeCalledTimes(1)
			expect(mocks.setStatus).toBeCalledWith(undefined, 'another-room', 'started')
		})
	})

	describe('uses words', () => {
		beforeEach(() => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'not-ready',
					numWords: 3,
					usesWords: 1,
					wordlists: JSON.stringify([]),
				} as RoomTable
			})
		})

		test('assigns targets to all players', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setTarget).toHaveBeenCalledTimes(3)
		})

		test('assigns words to all players', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setWords).toHaveBeenCalledTimes(3)
		})
	})

	describe("doesn't use words", () => {
		test('assigns targets to all players', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setTarget).toHaveBeenCalledTimes(3)
		})

		test("doesn't try to set words", async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setWords).toHaveBeenCalledTimes(0)
		})
	})

	describe('completed game', () => {
		beforeEach(() => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'completed',
					numWords: 3,
					usesWords: 1,
					wordlists: JSON.stringify([]),
				} as RoomTable
			})
		})

		test('listPlayersInRoom is called twice', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.listPlayersInRoom).toHaveBeenCalledTimes(2)
		})

		test('deletePlayer is called', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.deletePlayer).toHaveBeenCalledTimes(3)
		})

		test('insertPlayer is called', async () => {
			const result = await StartGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.deletePlayer).toHaveBeenCalledTimes(3)
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await StartGame(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return undefined
			})

			const result = await StartGame(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})
	})

	test('game started', async () => {
		mocks.findRoom.mockImplementationOnce(() => {
			return {
				name: 'test-room',
				status: 'started',
				numWords: 0,
				usesWords: 0,
				wordlists: JSON.stringify([]),
			} as RoomTable
		})

		const result = await StartGame(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(400)
		expect(resultJson.message).toEqual('Game has already started!')
	})

	test('not enough players', async () => {
		mocks.listPlayersInRoom.mockImplementationOnce(() => [])

		const result = await StartGame(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(400)
		expect(resultJson.message).toEqual('Must have at least 3 people signed up!')
	})

	test('not enough words', async () => {
		mocks.findRoom.mockImplementationOnce(() => {
			return {
				name: 'test-room',
				status: 'not-ready',
				numWords: 3,
				usesWords: 1,
				wordlists: JSON.stringify([]),
			} as RoomTable
		})
		mocks.listWordsInWordLists.mockImplementationOnce(() => [])

		const result = await StartGame(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(400)
		expect(resultJson.message).toEqual('There are not enough words to distribute!')
	})
})
