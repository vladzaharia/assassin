import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { UpdateRoom } from './update'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { RoomTable, WordListTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		setStatus: vi.fn(),
		setUsesWords: vi.fn(),
		setNumWords: vi.fn(),
		setWordLists: vi.fn(),
		findRoom: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				status: 'not-ready',
				numWords: 0,
				usesWords: 0,
				wordlists: JSON.stringify([]),
			} as RoomTable
		}),
		findWordList: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-list',
				description: 'This is a test wordlist.',
			} as WordListTable
		}),
	}
})

vi.mock('../../tables/room', () => {
	return {
		findRoom: mocks.findRoom,
		setStatus: mocks.setStatus,
		setUsesWords: mocks.setUsesWords,
		setWordLists: mocks.setWordLists,
		setNumWords: mocks.setNumWords,
	}
})

vi.mock('../../tables/wordlist', () => {
	return {
		findWordList: mocks.findWordList,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('UpdateRoom', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { room: 'test-room' }
				},
				json: () => {
					return {}
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await UpdateRoom(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Room updated successfully!')
	})

	describe('findRoom', async () => {
		test('calls method', async () => {
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { room: 'another-room' } })

			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	test('empty body', async () => {
		const result = await UpdateRoom(context)

		expect(result.status).toEqual(200)
		expect(mocks.setNumWords).toBeCalledTimes(0)
		expect(mocks.setStatus).toBeCalledTimes(0)
		expect(mocks.setUsesWords).toBeCalledTimes(0)
		expect(mocks.setWordLists).toBeCalledTimes(0)
	})

	test('everything set', async () => {
		modifyContext(context, '$.req.json', () => {
			return { numWords: 1, status: 'completed', usesWords: true, wordLists: [] }
		})
		const result = await UpdateRoom(context)

		expect(result.status).toEqual(200)
		expect(mocks.setNumWords).toBeCalledTimes(1)
		expect(mocks.setStatus).toBeCalledTimes(1)
		expect(mocks.setUsesWords).toBeCalledTimes(1)
		expect(mocks.setWordLists).toBeCalledTimes(1)
	})

	describe('numWords', () => {
		test('1', async () => {
			modifyContext(context, '$.req.json', () => {
				return { numWords: 1 }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setNumWords).toBeCalledTimes(1)
			expect(mocks.setNumWords).toBeCalledWith(undefined, 'test-room', 1)
		})

		test('100', async () => {
			modifyContext(context, '$.req.json', () => {
				return { numWords: 100 }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setNumWords).toBeCalledTimes(1)
			expect(mocks.setNumWords).toBeCalledWith(undefined, 'test-room', 100)
		})
	})

	describe('status', () => {
		test('started', async () => {
			modifyContext(context, '$.req.json', () => {
				return { status: 'started' }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setStatus).toBeCalledTimes(1)
			expect(mocks.setStatus).toBeCalledWith(undefined, 'test-room', 'started')
		})

		test('completed', async () => {
			modifyContext(context, '$.req.json', () => {
				return { status: 'completed' }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setStatus).toBeCalledTimes(1)
			expect(mocks.setStatus).toBeCalledWith(undefined, 'test-room', 'completed')
		})
	})

	describe('usesWords', () => {
		test('true', async () => {
			modifyContext(context, '$.req.json', () => {
				return { usesWords: true }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setUsesWords).toBeCalledTimes(1)
			expect(mocks.setUsesWords).toBeCalledWith(undefined, 'test-room', true)
		})

		test('false', async () => {
			modifyContext(context, '$.req.json', () => {
				return { usesWords: false }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setUsesWords).toBeCalledTimes(1)
			expect(mocks.setUsesWords).toBeCalledWith(undefined, 'test-room', false)
		})
	})

	describe('wordLists', () => {
		test('set', async () => {
			modifyContext(context, '$.req.json', () => {
				return { wordLists: ['some', 'word', 'list'] }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setWordLists).toBeCalledTimes(1)
			expect(mocks.setWordLists).toBeCalledWith(undefined, 'test-room', ['some', 'word', 'list'])
			expect(mocks.findWordList).toBeCalledTimes(3)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'some')
			expect(mocks.findWordList).toBeCalledWith(undefined, 'word')
			expect(mocks.findWordList).toBeCalledWith(undefined, 'list')
		})

		test('uses passed in body parameter', async () => {
			modifyContext(context, '$.req.json', () => {
				return { wordLists: ['another'] }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setWordLists).toBeCalledTimes(1)
			expect(mocks.setWordLists).toBeCalledWith(undefined, 'test-room', ['another'])
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'another')
		})

		test('empty list', async () => {
			modifyContext(context, '$.req.json', () => {
				return { wordLists: [] }
			})
			const result = await UpdateRoom(context)

			expect(result.status).toEqual(200)
			expect(mocks.setWordLists).toBeCalledTimes(1)
			expect(mocks.setWordLists).toBeCalledWith(undefined, 'test-room', [])
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await UpdateRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room does not exist', async () => {
			mocks.findRoom.mockImplementationOnce(() => undefined)

			const result = await UpdateRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room does not exist!')
		})

		test('word list does not exist', async () => {
			modifyContext(context, '$.req.json', () => {
				return { wordLists: ['some', 'word', 'list'] }
			})
			mocks.findWordList.mockImplementationOnce(() => undefined)

			const result = await UpdateRoom(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word list does not exist!')
		})
	})
})
