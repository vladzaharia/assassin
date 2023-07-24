import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { ResetGame } from './reset'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		setStatus: vi.fn(),
		deletePlayersInRoom: vi.fn(),
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
		deletePlayersInRoom: mocks.deletePlayersInRoom,
	}
})

vi.mock('../../tables/room', () => {
	return {
		findRoom: mocks.findRoom,
		setStatus: mocks.setStatus,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('ResetGame', () => {
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
		const result = await ResetGame(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Room reset successfully!')
	})

	describe('findRoom', async () => {
		test('calls method', async () => {
			const result = await ResetGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await ResetGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('deletePlayersInRoom', async () => {
		test('calls method', async () => {
			const result = await ResetGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.deletePlayersInRoom).toBeCalledTimes(1)
			expect(mocks.deletePlayersInRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await ResetGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.deletePlayersInRoom).toBeCalledTimes(1)
			expect(mocks.deletePlayersInRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('setStatus', async () => {
		test('calls method', async () => {
			const result = await ResetGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setStatus).toBeCalledTimes(1)
			expect(mocks.setStatus).toBeCalledWith(undefined, 'test-room', 'not-ready')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await ResetGame(context)

			expect(result.status).toEqual(200)
			expect(mocks.setStatus).toBeCalledTimes(1)
			expect(mocks.setStatus).toBeCalledWith(undefined, 'another-room', 'not-ready')
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await ResetGame(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return undefined
			})

			const result = await ResetGame(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})
	})
})
