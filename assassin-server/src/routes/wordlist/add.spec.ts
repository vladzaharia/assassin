import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { AddWordList } from './add'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { WordListTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		insertWordList: vi.fn(),
		findWordList: vi.fn().mockImplementation(async () => undefined),
	}
})

vi.mock('../../tables/wordlist', () => {
	return {
		findWordList: mocks.findWordList,
		insertWordList: mocks.insertWordList,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('AddWordList', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { list: 'test-list' }
				},
				json: () => {
					return {
						description: 'Some list used for testing.',
						icon: 'flask',
					}
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await AddWordList(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully added word list!')
	})

	describe('findWordList', () => {
		test('calls method', async () => {
			const result = await AddWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list', word: 'bar' }
			})
			const result = await AddWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('insertWordList', () => {
		test('calls method', async () => {
			const result = await AddWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertWordList).toBeCalledTimes(1)
			expect(mocks.insertWordList).toBeCalledWith(undefined, 'test-list', 'Some list used for testing.', 'flask')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list' }
			})
			modifyContext(context, '$.req.json', () => {
				return { description: 'Another list used for testing' }
			})

			const result = await AddWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertWordList).toBeCalledTimes(1)
			expect(mocks.insertWordList).toBeCalledWith(undefined, 'another-list', 'Another list used for testing', undefined)
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await AddWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('description not set', async () => {
			modifyContext(context, '$.req.json', () => {
				return {}
			})

			const result = await AddWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Must set `description`!')
		})

		test('word list already exists', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				return {
					name: 'test-list',
					description: 'A list used for testing',
					icon: 'flask',
				} as WordListTable
			})

			const result = await AddWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Word list already exists!')
		})
	})
})
