import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { DeleteWords } from './deleteWords'
import { createContext, modifyContext } from '../../../testutil'
import { vi } from 'vitest'
import { WordListTable } from '../../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		deleteWords: vi.fn(),
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
		deleteWords: mocks.deleteWords,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('DeleteWords', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { list: 'test-list', word: 'foo' }
				},
				json: () => {
					return { words: ['some', 'words', 'here'] }
				}
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await DeleteWords(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully deleted words!')
	})

	describe('findWordList', () => {
		test('calls method', async () => {
			const result = await DeleteWords(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { list: 'another-list' } })
			const result = await DeleteWords(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('deleteWords', () => {
		test('calls method', async () => {
			const result = await DeleteWords(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWords).toBeCalledTimes(1)
			expect(mocks.deleteWords).toBeCalledWith(undefined, 'test-list', ['some', 'words', 'here'])
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, "$.req.param", () => { return { list: 'another-list' } })
			modifyContext(context, "$.req.json", () => { return { words: ['other', 'words'] } })
			const result = await DeleteWords(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWords).toBeCalledTimes(1)
			expect(mocks.deleteWords).toBeCalledWith(undefined, 'another-list', ['other', 'words'])
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await DeleteWords(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('word list not found', async () => {
			mocks.findWordList.mockImplementationOnce(() => undefined)

			const result = await DeleteWords(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word list not found!')
		})

		test('word list undefined', async () => {
			modifyContext(context, "$.req.json", () => { return {} })

			const result = await DeleteWords(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Must provide `words` array!')
		})

		test('word list empty', async () => {
			modifyContext(context, "$.req.json", () => { return { words: [] } })

			const result = await DeleteWords(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Must provide `words` array!')
		})
	})
})
