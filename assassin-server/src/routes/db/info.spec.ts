import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { DbInfo } from './info'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { Migration } from '../../migrate/types'
import { MigrationTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		createMigrationTable: vi.fn(),
		getCurrentMigration: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-base-migration',
				version: 0,
				applied: 1672560000,
			} as MigrationTable
		}),
		listMigrations: vi.fn().mockImplementation(async () => {
			return [
				{
					name: 'test-base-migration',
					version: 0,
					applied: 1672560000,
				},
				{
					name: 'test-base-migration',
					version: 0,
					applied: 1672560000,
					rolledBack: 1672550000,
				},
			] as MigrationTable[]
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
		createMigrationTable: mocks.createMigrationTable,
		getCurrentMigration: mocks.getCurrentMigration,
		listMigrations: mocks.listMigrations,
	}
})

vi.mock('../../migrate', () => {
	return {
		getAvailableMigrations: mocks.getAvailableMigrations,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('DbInfo', () => {
	let context: Context<{ Bindings: Bindings }>
	beforeEach(() => {
		context = createContext()
	})

	test('error', async () => {
		mocks.createMigrationTable.mockImplementationOnce(() => {
			throw new Error('The apocalypse is upon us')
		})

		const result = await DbInfo(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(500)
		expect(resultJson.message).toEqual('Something went wrong!')
	})

	describe('binding', () => {
		test('check database binding', async () => {
			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.binding.type).toEqual('Cloudflare D1')
			expect(resultJson.binding.database).toEqual('assassin-test')
		})

		test('binding is based on ENVIRONMENT', async () => {
			modifyContext(context, '$.env.ENVIRONMENT', 'local')

			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.binding.type).toEqual('Cloudflare D1')
			expect(resultJson.binding.database).toEqual('assassin-local')
		})

		test('binding for live', async () => {
			modifyContext(context, '$.env.ENVIRONMENT', 'live')

			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.binding.type).toEqual('Cloudflare D1')
			expect(resultJson.binding.database).toEqual('assassin')
		})
	})

	describe('migrations.current', () => {
		test('shows current migration', async () => {
			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.migrations.current).toEqual({
				name: 'test-base-migration',
				version: 0,
				applied: 1672560000,
			})
		})

		test('migration is missing', async () => {
			mocks.getCurrentMigration.mockImplementationOnce(() => undefined)

			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.migrations.current).toBeUndefined()
		})
	})

	describe('migrations.applied', () => {
		test('shows applied migrations', async () => {
			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.migrations.applied.length).toEqual(2)
			expect(resultJson.migrations.applied[0]).toEqual({
				name: 'test-base-migration',
				version: 0,
				applied: 1672560000,
			})
			expect(resultJson.migrations.applied[1]).toEqual({
				name: 'test-base-migration',
				version: 0,
				applied: 1672560000,
				rolledBack: 1672550000,
			})
		})

		test('migrations are missing', async () => {
			mocks.listMigrations.mockImplementationOnce(() => [])

			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.migrations.applied.length).toEqual(0)
		})
	})

	describe('migrations.available', () => {
		test('shows available migrations', async () => {
			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.migrations.available.length).toEqual(2)
			expect(resultJson.migrations.available[0]).toEqual({
				name: 'test-first-migration',
				version: 1,
			})
			expect(resultJson.migrations.available[1]).toEqual({
				name: 'test-second-migration',
				version: 2,
			})
		})

		test('migrations are missing', async () => {
			mocks.getAvailableMigrations.mockImplementationOnce(() => [])

			const result = await DbInfo(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.migrations.available.length).toEqual(0)
		})
	})
})
