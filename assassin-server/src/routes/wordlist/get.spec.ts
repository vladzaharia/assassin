import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { GetWordList } from './get'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { WordListTable, WordTable } from '../../tables/db'
import { ManagedWordList } from './managed/types'

const mocks = vi.hoisted(() => {
	return {
		GetManagedWordlists: vi.fn().mockImplementation(
			() =>
				[
					{
						name: 'test-list-managed',
						description: 'A managed test list',
						words: ['some', 'words', 'here'],
						icon: 'flask',
					},
				] as ManagedWordList[]
		),
		listWordsInWordList: vi.fn().mockImplementation(
			async () =>
				[
					{
						list: 'test-list',
						word: 'some',
					},
					{
						list: 'test-list',
						word: 'word',
					},
					{
						list: 'test-list',
						word: 'here',
					},
				] as WordTable[]
		),
		findWordList: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-list',
				description: 'A list used for testing',
				icon: 'flask',
			} as WordListTable
		}),
	}
})

vi.mock('./managed', () => {
	return {
		GetManagedWordlists: mocks.GetManagedWordlists,
	}
})

vi.mock('../../tables/wordlist', () => {
	return {
		findWordList: mocks.findWordList,
	}
})

vi.mock('../../tables/word', () => {
	return {
		listWordsInWordList: mocks.listWordsInWordList,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('GetWordList', () => {
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

	describe('findWordList', () => {
		test('calls method', async () => {
			const result = await GetWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list', word: 'bar' }
			})
			const result = await GetWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('listWordsInWordList', () => {
		test('calls method', async () => {
			const result = await GetWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.listWordsInWordList).toBeCalledTimes(1)
			expect(mocks.listWordsInWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list' }
			})

			const result = await GetWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.listWordsInWordList).toBeCalledTimes(1)
			expect(mocks.listWordsInWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	describe('GetManagedWordlists', () => {
		test('calls method', async () => {
			const result = await GetWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.GetManagedWordlists).toBeCalledTimes(1)
			expect(mocks.GetManagedWordlists).toBeCalledWith()
		})
	})

	describe('name', () => {
		test('is set', async () => {
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.name).toEqual('test-list')
		})

		test('is based on db result', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				return {
					name: 'another-list',
					description: 'Another list used for testing',
					icon: 'circle',
				} as WordListTable
			})
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.name).toEqual('another-list')
		})
	})

	describe('description', () => {
		test('is set', async () => {
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.description).toEqual('A list used for testing')
		})

		test('is based on db result', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				return {
					name: 'another-list',
					description: 'Another list used for testing',
					icon: 'circle',
				} as WordListTable
			})
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.description).toEqual('Another list used for testing')
		})
	})

	describe('words', () => {
		test('is set', async () => {
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.words.length).toEqual(3)
			expect(resultJson.words).toEqual(['some', 'word', 'here'])
		})

		test('is based on db result', async () => {
			mocks.listWordsInWordList.mockImplementationOnce(
				() =>
					[
						{
							list: 'test-list',
							word: 'another',
						},
					] as WordTable[]
			)
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.words.length).toEqual(1)
			expect(resultJson.words).toEqual(['another'])
		})
	})

	describe('icon', () => {
		test('is set', async () => {
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.icon).toEqual('flask')
		})

		test('is based on db result', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				return {
					name: 'another-list',
					description: 'Another list used for testing',
					icon: 'circle',
				} as WordListTable
			})
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.icon).toEqual('circle')
		})
	})

	describe('managed', () => {
		test('false', async () => {
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.managed).toEqual(false)
		})

		test('true', async () => {
			mocks.GetManagedWordlists.mockImplementationOnce(
				() =>
					[
						{
							name: 'test-list',
							description: 'A managed test list',
							words: ['some', 'words', 'here'],
							icon: 'flask',
						},
					] as ManagedWordList[]
			)
			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.managed).toEqual(true)
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('word list not found', async () => {
			mocks.findWordList.mockImplementationOnce(() => undefined)

			const result = await GetWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word list not found!')
		})
	})
})
