import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { ResetDb } from './reset'
import { createContext } from '../../testutil'
import { vi } from 'vitest'

const mocks = vi.hoisted(() => {
	return {
		dropMigrationTable: vi.fn(),
		dropPlayerTable: vi.fn(),
		dropRoomTable: vi.fn(),
		dropWordTable: vi.fn(),
		dropWordListTable: vi.fn(),
	}
})

vi.mock('../../tables/migration', () => {
	return {
		dropMigrationTable: mocks.dropMigrationTable,
	}
})

vi.mock('../../tables/player', () => {
	return {
		dropPlayerTable: mocks.dropPlayerTable,
	}
})

vi.mock('../../tables/room', () => {
	return {
		dropRoomTable: mocks.dropRoomTable,
	}
})

vi.mock('../../tables/word', () => {
	return {
		dropWordTable: mocks.dropWordTable,
	}
})

vi.mock('../../tables/wordlist', () => {
	return {
		dropWordListTable: mocks.dropWordListTable,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('MigrateDb', () => {
	let context: Context<{ Bindings: Bindings }>
	beforeEach(() => {
		context = createContext()
	})

	test('all tables are dropped', async () => {
		const result = await ResetDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Database reset successfully!')
		expect(mocks.dropMigrationTable).toBeCalledTimes(1)
		expect(mocks.dropPlayerTable).toBeCalledTimes(1)
		expect(mocks.dropRoomTable).toBeCalledTimes(1)
		expect(mocks.dropWordTable).toBeCalledTimes(1)
		expect(mocks.dropWordListTable).toBeCalledTimes(1)
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.dropRoomTable.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await ResetDb(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})
	})
})
