import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { RollbackDb } from './rollback'
import { createContext } from '../../testutil'
import { vi } from 'vitest'
import { MigrationTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		rollback: vi.fn(),
		getCurrentMigration: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-first-migration',
				version: 1,
				applied: 1672560000,
			} as MigrationTable
		}),
	}
})

vi.mock('../../tables/migration', () => {
	return {
		getCurrentMigration: mocks.getCurrentMigration,
	}
})

vi.mock('../../migrate', () => {
	return {
		rollback: mocks.rollback,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('RollbackDb', () => {
	let context: Context<{ Bindings: Bindings }>
	beforeEach(() => {
		context = createContext()
	})

	test('error', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			throw new Error('The apocalypse is upon us')
		})

		const result = await RollbackDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(500)
		expect(resultJson.message).toEqual('Something went wrong!')
	})

	test('rollback is called', async () => {
		const result = await RollbackDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Migrations rolled back successfully!')
		expect(mocks.rollback).toBeCalledTimes(1)
	})

	test('version comes from getCurrentMigration', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			mocks.getCurrentMigration.mockImplementationOnce(() => {
				return { version: 2 }
			})
			return { version: 1 }
		})
		const result = await RollbackDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.oldVersion).toEqual(1)
		expect(resultJson.newVersion).toEqual(2)
	})

	test('no new version', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			mocks.getCurrentMigration.mockImplementationOnce(() => {
				return undefined
			})
			return { version: 1 }
		})
		const result = await RollbackDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.oldVersion).toEqual(1)
		expect(resultJson.newVersion).toEqual(-1)
	})

	test('no migrations to roll back', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => undefined)

		const result = await RollbackDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(400)
		expect(resultJson.message).toEqual('No migrations to roll back!')
		expect(mocks.rollback).toBeCalledTimes(0)
	})

	test("can't roll back version 0", async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			return {
				name: 'test-first-migration',
				version: 0,
				applied: 1672560000,
			} as MigrationTable
		})

		const result = await RollbackDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(400)
		expect(resultJson.message).toEqual("Can't roll back migration 0!")
		expect(mocks.rollback).toBeCalledTimes(0)
	})
})
