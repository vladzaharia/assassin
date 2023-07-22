import { RoomTable, PlayerTable } from '../tables/db'
import { GMAuth } from './gm'
import { vi } from 'vitest'
import { Context } from 'hono'
import { AuthException } from './common'
import { SignJWT } from 'jose'
import { createContext, modifyContext } from '../testutil'
import { Bindings } from '../bindings'

const mocks = vi.hoisted(() => {
	return {
		findRoomMock: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				numWords: 0,
				status: 'started',
				usesWords: 0,
				wordlists: JSON.stringify([]),
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

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

let context: Context<{ Bindings: Bindings }>

beforeEach(() => {
	context = createContext({
		req: {
			header: () => 'test-player',
			param: () => {
				return { room: 'test-room', name: 'test-player' }
			},
		},
	} as unknown as Context<{ Bindings: Bindings }>)
})

describe('GMAuth', () => {
	test('auth is successful', async () => {
		const result = await GMAuth(context)
		expect(result).toBeTruthy()
	})

	test('auth is unsuccessful if on a different player', async () => {
		modifyContext(context, '$.req.header', () => 'Vlad')

		const result = await GMAuth(context)
		expect(result).toBeFalsy()
	})

	test('auth is unsuccessful if room is not found', async () => {
		mocks.findRoomMock.mockImplementationOnce(() => undefined)

		expect(() => GMAuth(context)).rejects.toEqual(new AuthException('Room not found!', 404))
	})

	test('auth uses JWT if normal user header is not defined', async () => {
		const token = await new SignJWT({ assassin: { admin: false, user: true }, first_name: 'test-player' })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('kv-test-secret'))

		modifyContext(context, '$.req.header', (key) => (key === 'Authorization' ? `Bearer ${token}` : undefined))

		const result = await GMAuth(context)
		expect(result).toBeTruthy()
	})

	test('auth is unsuccessful if on a different player, using JWT', async () => {
		const token = await new SignJWT({ assassin: { admin: false, user: true }, first_name: 'Vlad' })
			.setProtectedHeader({ alg: 'HS256' })
			.sign(new TextEncoder().encode('kv-test-secret'))

		modifyContext(context, '$.req.header', (key) => (key === 'Authorization' ? `Bearer ${token}` : undefined))

		const result = await GMAuth(context)
		expect(result).toBeFalsy()
	})
})
