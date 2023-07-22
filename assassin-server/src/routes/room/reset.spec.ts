import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { ResetGame } from './reset'
import { createContext } from '../../testutil'
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

	test('calls setStatus', async () => {
		const result = await ResetGame(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Room reset successfully!')
		expect(mocks.setStatus).toBeCalledTimes(1)
		expect(mocks.setStatus).toBeCalledWith(undefined, 'test-room', 'not-ready')
	})

	test('calls deletePlayersInRoom', async () => {
		const result = await ResetGame(context)

		expect(result.status).toEqual(200)
		expect(mocks.deletePlayersInRoom).toBeCalledTimes(1)
		expect(mocks.deletePlayersInRoom).toBeCalledWith(undefined, 'test-room')
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
