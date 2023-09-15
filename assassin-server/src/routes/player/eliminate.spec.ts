import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { EliminatePlayer } from './eliminate'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { PlayerTable, RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		setStatus: vi.fn(),
		setRoomStatus: vi.fn(),
		setTarget: vi.fn(),
		setWords: vi.fn(),
		findPlayer: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 0,
				status: 'alive',
				target: 'test-player-2',
				words: JSON.stringify(['some', 'words', 'here']),
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
		setStatus: mocks.setStatus,
		setTarget: mocks.setTarget,
		setWords: mocks.setWords,
	}
})

vi.mock('../../tables/room', () => {
	return {
		findRoom: mocks.findRoom,
		setStatus: mocks.setRoomStatus,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('EliminatePlayer', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { room: 'test-room', name: 'test-player' }
				},
				json: () => {
					return { word: 'words' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await EliminatePlayer(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully eliminated test-player-2!')
	})

	describe('findRoom', async () => {
		test('calls method', async () => {
			const result = await EliminatePlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room', name: 'test-player-3' }
			})

			const result = await EliminatePlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('findPlayer', async () => {
		test('calls method', async () => {
			const result = await EliminatePlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findPlayer).toBeCalledTimes(2)
			expect(mocks.findPlayer).toBeCalledWith(undefined, 'test-room', 'test-player')
			expect(mocks.findPlayer).toBeCalledWith(undefined, 'test-room', 'test-player-2')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room', name: 'test-player-3' }
			})

			const result = await EliminatePlayer(context)

			expect(result.status).toEqual(200)
			expect(mocks.findPlayer).toBeCalledTimes(2)
			expect(mocks.findPlayer).toBeCalledWith(undefined, 'another-room', 'test-player-3')
		})
	})

	test('calls setStatus on target', async () => {
		const result = await EliminatePlayer(context)

		expect(result.status).toEqual(200)
		expect(mocks.setStatus).toBeCalledWith(undefined, 'test-room', 'test-player-2', 'eliminated')
	})

	test("assigns target's target", async () => {
		mocks.findPlayer.mockImplementationOnce(async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				return {
					name: 'test-player2',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player-3',
					words: JSON.stringify(['some', 'words', 'here']),
				} as PlayerTable
			})
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 0,
				status: 'alive',
				target: 'test-player-2',
				words: JSON.stringify(['some', 'words', 'here']),
			} as PlayerTable
		})

		const result = await EliminatePlayer(context)

		expect(result.status).toEqual(200)
		expect(mocks.setTarget).toBeCalledWith(undefined, 'test-room', 'test-player', 'test-player-3')
	})

	test("assigns target's words", async () => {
		mocks.findPlayer.mockImplementationOnce(async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				return {
					name: 'test-player2',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player-3',
					words: JSON.stringify(['other', 'things', 'incoming']),
				} as PlayerTable
			})
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 0,
				status: 'alive',
				target: 'test-player-2',
				words: JSON.stringify(['some', 'words', 'here']),
			} as PlayerTable
		})

		const result = await EliminatePlayer(context)

		expect(result.status).toEqual(200)
		expect(mocks.setWords).toBeCalledWith(undefined, 'test-room', 'test-player', ['some', 'here', 'other', 'things', 'incoming'])
	})

	test('champion has won', async () => {
		mocks.findPlayer.mockImplementationOnce(async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				return {
					name: 'test-player2',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player',
					words: JSON.stringify(['some', 'words', 'here']),
				} as PlayerTable
			})
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 0,
				status: 'alive',
				target: 'test-player-2',
				words: JSON.stringify(['some', 'words', 'here']),
			} as PlayerTable
		})

		const result = await EliminatePlayer(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(299)
		expect(resultJson.message).toEqual('Congratulations, you have won the game!')
		expect(mocks.setRoomStatus).toBeCalledWith(undefined, 'test-room', 'completed')
		expect(mocks.setStatus).toBeCalledWith(undefined, 'test-room', 'test-player', 'champion')
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(async () => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await EliminatePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(async () => undefined)

			const result = await EliminatePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})

		test('player not found', async () => {
			mocks.findPlayer.mockImplementationOnce(async () => undefined)

			const result = await EliminatePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Player not found!')
		})

		test('game has not started', async () => {
			mocks.findRoom.mockImplementationOnce(async () => {
				return {
					name: 'test-room',
					status: 'not-ready',
					numWords: 0,
					usesWords: 0,
					wordlists: JSON.stringify([]),
				} as RoomTable
			})

			const result = await EliminatePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Game has not started!')
		})

		test('player not alive', async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'eliminated',
				} as PlayerTable
			})

			const result = await EliminatePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Player is not alive!')
		})

		test('word not available for use', async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player-2',
					words: JSON.stringify(['some', 'word', 'here']),
				} as PlayerTable
			})

			const result = await EliminatePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Word is not available for use!')
		})

		test('target not found', async () => {
			mocks.findPlayer.mockImplementationOnce(async () => {
				mocks.findPlayer.mockImplementationOnce(async () => undefined)
				return {
					name: 'test-player',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
					target: 'test-player-2',
					words: JSON.stringify(['some', 'words', 'here']),
				} as PlayerTable
			})

			const result = await EliminatePlayer(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Target not found!')
		})
	})
})
