import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { AddRoom } from './add'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		insertRoom: vi.fn(),
		findRoom: vi.fn().mockImplementation(async () => {
			return undefined
		}),
	}
})

vi.mock('../../tables/room', () => {
	return {
		findRoom: mocks.findRoom,
		insertRoom: mocks.insertRoom,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('AddRoom', () => {
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
		const result = await AddRoom(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Room created successfully!')
	})

	describe('findRoom', async () => {
		test('calls method', async () => {
			const result = await AddRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { room: 'another-room' } })

			const result = await AddRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('insertRoom', async () => {
		test('calls method', async () => {
			const result = await AddRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertRoom).toBeCalledTimes(1)
			expect(mocks.insertRoom).toBeCalledWith(undefined, 'test-room', false)
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { room: 'another-room' } })

			const result = await AddRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertRoom).toBeCalledTimes(1)
			expect(mocks.insertRoom).toBeCalledWith(undefined, 'another-room', false)
		})
	})


	describe('usesWords', () => {
		test('true', async () => {
			modifyContext(context, '$.req.body', 'something')
			modifyContext(context, '$.req.json', () => {
				return { usesWords: true }
			})

			const result = await AddRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.message).toEqual('Room created successfully!')
			expect(mocks.insertRoom).toBeCalledTimes(1)
			expect(mocks.insertRoom).toBeCalledWith(undefined, 'test-room', true)
		})

		test('false', async () => {
			modifyContext(context, '$.req.body', 'something')
			modifyContext(context, '$.req.json', () => {
				return { usesWords: false }
			})

			const result = await AddRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.message).toEqual('Room created successfully!')
			expect(mocks.insertRoom).toBeCalledTimes(1)
			expect(mocks.insertRoom).toBeCalledWith(undefined, 'test-room', false)
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await AddRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room already exists', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				return {
					name: 'test-room',
					status: 'not-ready',
					numWords: 0,
					usesWords: 0,
					wordlists: JSON.stringify([]),
				} as RoomTable
			})

			const result = await AddRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Room already exists!')
		})
	})
})
