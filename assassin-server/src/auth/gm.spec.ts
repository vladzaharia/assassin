import { RoomTable, PlayerTable } from '../tables/db'
import { GMAuth } from './gm'
import { vi } from 'vitest'
import { Context } from 'hono'
import { AuthException } from './common'

const mocks = vi.hoisted(() => {
	return {
		findRoomMock: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				numWords: 0,
				status: 'started',
				usesWords: 0,
				wordlists: '[]',
			} as RoomTable
		}),
		findRoomGM: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 1,
				status: 'alive',
			} as PlayerTable
		}),
	}
})

// Mock finding room
vi.mock('../tables/room', () => {
	return {
		findRoom: mocks.findRoomMock,
	}
})

// Mock finding room GM
vi.mock('../tables/player', () => {
	return {
		findRoomGM: mocks.findRoomGM,
	}
})

let context: Context<{ Bindings }>

beforeEach(() => {
	context = {
		env: {
			ASSASSIN_SECRET: 'some-test-secret',
			OPENID: {
				get: async () => undefined,
			},
		},
		req: {
			header: () => 'test-player',
			param: () => {
				return { room: 'test-room', name: 'test-player' }
			},
		},
	} as unknown as Context<{ Bindings }>
})

describe('GMAuth', () => {
	test('auth is successful', async () => {
		const result = await GMAuth(context)
		expect(result).toBeTruthy()
	})

	test('auth is unsuccessful if on a different player', async () => {
		context.req.header = () => 'Vlad'

		const result = await GMAuth(context)
		expect(result).toBeFalsy()
	})

	test('auth is unsuccessful if room is not found', async () => {
		mocks.findRoomMock.mockImplementationOnce(() => undefined)

		expect(() => GMAuth(context)).rejects.toEqual(new AuthException('Room not found!', 404))
	})
})
