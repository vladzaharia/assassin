import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { MigrateDb } from './migrate'
import { createContext } from '../../testutil'
import { vi } from 'vitest'
import { Migration } from '../../migrate/types'
import { MigrationTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		migrate: vi.fn(),
		getCurrentMigration: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-base-migration',
				version: 0,
				applied: 1672560000,
			} as MigrationTable
		}),
		getAvailableMigrations: vi.fn().mockImplementation(async () => {
			return [
				{
					name: 'test-first-migration',
					version: 1,
					up: vi.fn(),
					down: vi.fn(),
				},
				{
					name: 'test-second-migration',
					version: 2,
					up: vi.fn(),
					down: vi.fn(),
				},
			] as Migration[]
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
		migrate: mocks.migrate,
		getAvailableMigrations: mocks.getAvailableMigrations,
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

	test('error', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			throw new Error('The apocalypse is upon us')
		})

		const result = await MigrateDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(500)
		expect(resultJson.message).toEqual('Something went wrong!')
	})

	test('migrate is called', async () => {
		const result = await MigrateDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.message).toEqual('Migrations applied successfully!')
		expect(mocks.migrate).toBeCalledTimes(1)
	})

	test('version comes from getCurrentMigration', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			mocks.getCurrentMigration.mockImplementationOnce(() => {
				return { version: 2 }
			})
			return { version: 1 }
		})
		const result = await MigrateDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.oldVersion).toEqual(1)
		expect(resultJson.newVersion).toEqual(2)
		expect(mocks.migrate).toBeCalledTimes(1)
	})

	test('no current migration', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			mocks.getCurrentMigration.mockImplementationOnce(() => {
				return undefined
			})
			return undefined
		})
		const result = await MigrateDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.oldVersion).toEqual(-1)
		expect(resultJson.newVersion).toEqual(-1)
		expect(mocks.migrate).toBeCalledTimes(1)
	})

	test('no migrations available', async () => {
		mocks.getAvailableMigrations.mockImplementationOnce(() => [])

		const result = await MigrateDb(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(400)
		expect(resultJson.message).toEqual('No migrations to apply!')
	})
})
