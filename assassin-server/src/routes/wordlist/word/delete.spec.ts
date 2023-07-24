import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { DeleteWord } from './delete'
import { createContext, modifyContext } from '../../../testutil'
import { vi } from 'vitest'
import { RoomTable, WordListTable } from '../../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		deleteWord: vi.fn(),
		findWord: vi.fn().mockImplementation(async () => {
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
				name: "test-list",
				description: "A list used for testing",
				icon: "flask"
			} as WordListTable
		})
	}
})

vi.mock('../../../tables/wordlist', () => {
	return {
		findWordList: mocks.findWordList
	}
})

vi.mock('../../../tables/word', () => {
	return {
		findWord: mocks.findWord,
		deleteWord: mocks.deleteWord,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('DeleteWord', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { list: 'test-list', word: 'foo' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await DeleteWord(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully deleted word!')
	})

	describe('findWordList', () => {
		test('calls method', async () => {
			const result = await DeleteWord(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { list: 'another-list', word: 'bar' } })
			const result = await DeleteWord(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('findWord', () => {
		test('calls method', async () => {
			const result = await DeleteWord(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWord).toBeCalledTimes(1)
			expect(mocks.findWord).toBeCalledWith(undefined, 'test-list', 'foo')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { list: 'another-list', word: 'bar' } })
			const result = await DeleteWord(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWord).toBeCalledTimes(1)
			expect(mocks.findWord).toBeCalledWith(undefined, 'another-list', 'bar')
		})
	})

	describe('deleteWord', () => {
		test('calls method', async () => {
			const result = await DeleteWord(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWord).toBeCalledTimes(1)
			expect(mocks.deleteWord).toBeCalledWith(undefined, 'test-list', 'foo')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { list: 'another-list', word: 'bar' } })

			const result = await DeleteWord(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWord).toBeCalledTimes(1)
			expect(mocks.deleteWord).toBeCalledWith(undefined, 'another-list', 'bar')
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findWord.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await DeleteWord(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('word list not found', async () => {
			mocks.findWordList.mockImplementationOnce(() => undefined)

			const result = await DeleteWord(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word list not found!')
		})

		test('word not found', async () => {
			mocks.findWord.mockImplementationOnce(() => undefined)

			const result = await DeleteWord(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word not found!')
		})
	})
})
