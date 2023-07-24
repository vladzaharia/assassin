import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { DeleteWordList } from './delete'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { WordListTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		deleteWordList: vi.fn(),
		deleteWordsInWordList: vi.fn(),
		findWordList: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-list',
				description: 'A list used for testing',
				icon: 'flask',
			} as WordListTable
		}),
	}
})

vi.mock('../../tables/wordlist', () => {
	return {
		findWordList: mocks.findWordList,
		deleteWordList: mocks.deleteWordList,
	}
})

vi.mock('../../tables/word', () => {
	return {
		deleteWordsInWordList: mocks.deleteWordsInWordList,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('DeleteWordList', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { list: 'test-list' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await DeleteWordList(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully deleted word list!')
	})

	describe('findWordList', () => {
		test('calls method', async () => {
			const result = await DeleteWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list', word: 'bar' }
			})
			const result = await DeleteWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('deleteWordList', () => {
		test('calls method', async () => {
			const result = await DeleteWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list' }
			})

			const result = await DeleteWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('deleteWordsInWordList', () => {
		test('calls method', async () => {
			const result = await DeleteWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordsInWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordsInWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list' }
			})

			const result = await DeleteWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordsInWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordsInWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await DeleteWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('word list not found', async () => {
			mocks.findWordList.mockImplementationOnce(() => undefined)

			const result = await DeleteWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word list not found!')
		})
	})
})
