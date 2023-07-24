import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { ImportManagedWordList } from './import'
import { createContext, modifyContext } from '../../../testutil'
import { vi } from 'vitest'
import { ManagedWordList } from './types'

const mocks = vi.hoisted(() => {
	return {
		deleteWordList: vi.fn(),
		insertWordList: vi.fn(),
		deleteWordsInWordList: vi.fn(),
		insertWords: vi.fn(),
		GetManagedWordlists: vi.fn().mockImplementation(
			() =>
				[
					{
						name: 'managed-test-list',
						description: 'A managed list used for testing',
						words: ['some', 'words', 'here'],
						icon: 'flask',
					},
					{
						name: 'another-managed-list',
						description: 'Another managed list used for testing',
						words: ['foo', 'bar'],
					},
				] as ManagedWordList[]
		),
	}
})

vi.mock('.', () => {
	return {
		GetManagedWordlists: mocks.GetManagedWordlists,
	}
})

vi.mock('../../../tables/wordlist', () => {
	return {
		insertWordList: mocks.insertWordList,
		deleteWordList: mocks.deleteWordList,
	}
})

vi.mock('../../../tables/word', () => {
	return {
		insertWords: mocks.insertWords,
		deleteWordsInWordList: mocks.deleteWordsInWordList,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('ImportManagedWordList', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { importList: 'managed-test-list' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await ImportManagedWordList(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Successfully imported word list!')
	})

	describe('deleteWordsInWordList', () => {
		test('calls method', async () => {
			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordsInWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordsInWordList).toBeCalledWith(undefined, 'managed-test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { importList: 'another-managed-list' }
			})

			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordsInWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordsInWordList).toBeCalledWith(undefined, 'another-managed-list')
		})
	})

	describe('deleteWordList', () => {
		test('calls method', async () => {
			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordList).toBeCalledWith(undefined, 'managed-test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { importList: 'another-managed-list' }
			})

			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.deleteWordList).toBeCalledTimes(1)
			expect(mocks.deleteWordList).toBeCalledWith(undefined, 'another-managed-list')
		})
	})

	describe('insertWordList', () => {
		test('calls method', async () => {
			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertWordList).toBeCalledTimes(1)
			expect(mocks.insertWordList).toBeCalledWith(undefined, 'managed-test-list', 'A managed list used for testing', 'flask')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { importList: 'another-managed-list' }
			})

			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertWordList).toBeCalledTimes(1)
			expect(mocks.insertWordList).toBeCalledWith(undefined, 'another-managed-list', 'Another managed list used for testing', undefined)
		})
	})

	describe('insertWords', () => {
		test('calls method', async () => {
			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertWords).toBeCalledTimes(1)
			expect(mocks.insertWords).toBeCalledWith(undefined, 'managed-test-list', ['some', 'words', 'here'])
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { importList: 'another-managed-list' }
			})

			const result = await ImportManagedWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.insertWords).toBeCalledTimes(1)
			expect(mocks.insertWords).toBeCalledWith(undefined, 'another-managed-list', ['foo', 'bar'])
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.GetManagedWordlists.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await ImportManagedWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('word list not found', async () => {
			modifyContext(context, '$.req.param', () => {
				return { importList: 'some-other-list' }
			})

			const result = await ImportManagedWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word list not found!')
		})
	})
})
