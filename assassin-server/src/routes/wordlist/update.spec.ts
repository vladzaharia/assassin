import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { UpdateWordList } from './update'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { WordListTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		setIcon: vi.fn(),
		setDescription: vi.fn(),
		isManagedList: vi.fn().mockImplementation(() => false),
		findWordList: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-list',
				description: 'This is a test wordlist.',
			} as WordListTable
		}),
	}
})

vi.mock('./managed/util', () => {
	return {
		isManagedList: mocks.isManagedList,
	}
})

vi.mock('../../tables/wordlist', () => {
	return {
		findWordList: mocks.findWordList,
		setDescription: mocks.setDescription,
		setIcon: mocks.setIcon,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('UpdateWordList', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { list: 'test-list' }
				},
				json: () => {
					return {}
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	test('returns 200 / success message', async () => {
		const result = await UpdateWordList(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Word list updated succesfully!')
	})

	describe('findWordList', async () => {
		test('calls method', async () => {
			const result = await UpdateWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'test-list')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list' }
			})

			const result = await UpdateWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.findWordList).toBeCalledTimes(1)
			expect(mocks.findWordList).toBeCalledWith(undefined, 'another-list')
		})
	})

	test('empty body', async () => {
		const result = await UpdateWordList(context)

		expect(result.status).toEqual(200)
		expect(mocks.setDescription).toBeCalledTimes(0)
		expect(mocks.setIcon).toBeCalledTimes(0)
	})

	test('everything set', async () => {
		modifyContext(context, '$.req.json', () => {
			return { description: 'Some new description here', icon: 'circle' }
		})
		const result = await UpdateWordList(context)

		expect(result.status).toEqual(200)
		expect(mocks.setDescription).toBeCalledTimes(1)
		expect(mocks.setIcon).toBeCalledTimes(1)
	})

	describe('description', () => {
		test('is set', async () => {
			modifyContext(context, '$.req.json', () => {
				return { description: 'Some new description here' }
			})
			const result = await UpdateWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.setDescription).toBeCalledTimes(1)
			expect(mocks.setDescription).toBeCalledWith(undefined, 'test-list', 'Some new description here')
		})

		test('uses passed in parameters', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list' }
			})
			modifyContext(context, '$.req.json', () => {
				return { description: 'Another new description here' }
			})
			const result = await UpdateWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.setDescription).toBeCalledTimes(1)
			expect(mocks.setDescription).toBeCalledWith(undefined, 'another-list', 'Another new description here')
		})
	})

	describe('icon', () => {
		test('is set', async () => {
			modifyContext(context, '$.req.json', () => {
				return { icon: 'circle' }
			})
			const result = await UpdateWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.setIcon).toBeCalledTimes(1)
			expect(mocks.setIcon).toBeCalledWith(undefined, 'test-list', 'circle')
		})

		test('uses passed in parameters', async () => {
			modifyContext(context, '$.req.param', () => {
				return { list: 'another-list' }
			})
			modifyContext(context, '$.req.json', () => {
				return { icon: 'square' }
			})
			const result = await UpdateWordList(context)

			expect(result.status).toEqual(200)
			expect(mocks.setIcon).toBeCalledTimes(1)
			expect(mocks.setIcon).toBeCalledWith(undefined, 'another-list', 'square')
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findWordList.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await UpdateWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('word list does not exist', async () => {
			mocks.findWordList.mockImplementationOnce(() => undefined)

			const result = await UpdateWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Word list does not exist!')
		})

		test('word list is managed', async () => {
			mocks.isManagedList.mockImplementationOnce(() => true)

			const result = await UpdateWordList(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(400)
			expect(resultJson.message).toEqual('Word list is managed!')
		})
	})
})
