import { vi } from 'vitest'
import { Migration } from './types'
import {
	getAvailableMigrations,
	migrate,
	rollback,
	rollbackAllMigrations,
	rollbackMigration,
	runAllMigrations,
	runMigration,
} from './index'
import { MigrationTable } from '../tables/db'

const mocks = vi.hoisted(() => {
	const migrateUp = vi.fn()
	const migrateDown = vi.fn()

	return {
		migrateUp,
		migrateDown,
		getAllMigrations: vi.fn().mockImplementation(() => {
			return [
				{
					name: 'test-base-migration',
					version: 0,
					up: migrateUp,
					down: migrateDown,
				},
				{
					name: 'test-first-migration',
					version: 1,
					up: migrateUp,
					down: migrateDown,
				},
				{
					name: 'test-second-migration',
					version: 2,
					up: migrateUp,
					down: migrateDown,
				},
			] as Migration[]
		}),
		getCurrentMigration: vi.fn().mockImplementation(() => {
			return {
				name: 'test-base-migration',
				version: 0,
				applied: 1672560000
			} as MigrationTable
		}),
		insertMigration: vi.fn(),
		updateRollback: vi.fn(),
	}
})

vi.mock('./migrations', () => {
	return {
		getAllMigrations: mocks.getAllMigrations,
	}
})

vi.mock('../tables/migration', () => {
	return {
		getCurrentMigration: mocks.getCurrentMigration,
		insertMigration: mocks.insertMigration,
		updateRollback: mocks.updateRollback,
	}
})

const TestMigrations = [
	{
		name: 'test-base-migration',
		version: 0,
		up: mocks.migrateUp,
		down: mocks.migrateDown,
	},
	{
		name: 'test-first-migration',
		version: 1,
		up: mocks.migrateUp,
		down: mocks.migrateDown,
	},
	{
		name: 'test-second-migration',
		version: 2,
		up: mocks.migrateUp,
		down: mocks.migrateDown,
	},
]

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('getAvailableMigrations', () => {
	test('Get migrations bigger than current version', async () => {
		const result = await getAvailableMigrations({})
		expect(result.length).toEqual(2)
		expect(result[0].name).toEqual(TestMigrations[1].name)
		expect(result[0].version).toEqual(TestMigrations[1].version)
		expect(result[1].name).toEqual(TestMigrations[2].name)
		expect(result[1].version).toEqual(TestMigrations[2].version)
	})

	test('Migrations reflect available ones', async () => {
		mocks.getAllMigrations.mockImplementationOnce(() => {
			return [TestMigrations[2]]
		})

		const result = await getAvailableMigrations({})
		expect(result.length).toEqual(1)
		expect(result[0].name).toEqual(TestMigrations[2].name)
		expect(result[0].version).toEqual(TestMigrations[2].version)
	})

	test('Migrations reflect current one', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			return TestMigrations[1]
		})

		const result = await getAvailableMigrations({})
		expect(result.length).toEqual(1)
		expect(result[0].name).toEqual(TestMigrations[2].name)
		expect(result[0].version).toEqual(TestMigrations[2].version)
	})

	test('Migrations when no current migration', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			return undefined
		})

		const result = await getAvailableMigrations({})
		expect(result.length).toEqual(3)
		expect(result[0].name).toEqual(TestMigrations[0].name)
		expect(result[0].version).toEqual(TestMigrations[0].version)
		expect(result[1].name).toEqual(TestMigrations[1].name)
		expect(result[1].version).toEqual(TestMigrations[1].version)
		expect(result[2].name).toEqual(TestMigrations[2].name)
		expect(result[2].version).toEqual(TestMigrations[2].version)
	})
})

describe('runAllMigrations', () => {
	test('Runs all migrations', async () => {
		await runAllMigrations({})
		expect(mocks.insertMigration).toBeCalledTimes(TestMigrations.length)
		expect(mocks.migrateUp).toBeCalledTimes(TestMigrations.length)
	})

	test('Different migration list', async () => {
		mocks.getAllMigrations.mockImplementationOnce(() => {
			return [TestMigrations[0]]
		})

		await runAllMigrations({})
		expect(mocks.insertMigration).toBeCalledTimes(1)
		expect(mocks.migrateUp).toBeCalledTimes(1)
	})

	test('Empty list', async () => {
		mocks.getAllMigrations.mockImplementationOnce(() => {
			return []
		})

		await runAllMigrations({})
		expect(mocks.insertMigration).toBeCalledTimes(0)
		expect(mocks.migrateUp).toBeCalledTimes(0)
	})
})

describe('rollbackAllMigrations', () => {
	test('Rolls back all migrations', async () => {
		await rollbackAllMigrations({})
		expect(mocks.updateRollback).toBeCalledTimes(TestMigrations.length)
		expect(mocks.migrateDown).toBeCalledTimes(TestMigrations.length)
	})

	test('Different migration list', async () => {
		mocks.getAllMigrations.mockImplementationOnce(() => {
			return [TestMigrations[0]]
		})

		await rollbackAllMigrations({})
		expect(mocks.updateRollback).toBeCalledTimes(1)
		expect(mocks.migrateDown).toBeCalledTimes(1)
	})

	test('Empty list', async () => {
		mocks.getAllMigrations.mockImplementationOnce(() => {
			return []
		})

		await rollbackAllMigrations({})
		expect(mocks.updateRollback).toBeCalledTimes(0)
		expect(mocks.migrateDown).toBeCalledTimes(0)
	})
})

describe('migrate', () => {
	test('Runs migrations above current version', async () => {
		await migrate({})
		expect(mocks.insertMigration).toBeCalledTimes(TestMigrations.length - 1)
		expect(mocks.migrateUp).toBeCalledTimes(TestMigrations.length - 1)
	})

	test('Runs all migrations when none exists', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			return undefined
		})

		await migrate({})
		expect(mocks.insertMigration).toBeCalledTimes(TestMigrations.length)
		expect(mocks.migrateUp).toBeCalledTimes(TestMigrations.length)
	})

	test('No migrations to apply', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			return TestMigrations[2]
		})

		await migrate({})
		expect(mocks.insertMigration).toBeCalledTimes(0)
		expect(mocks.migrateUp).toBeCalledTimes(0)
	})
})

describe('rollback', () => {
	test('Rolls back latest migration', async () => {
		await rollback({})
		expect(mocks.updateRollback).toBeCalledTimes(1)
		expect(mocks.migrateDown).toBeCalledTimes(1)
	})

	test('No migration to rollback', async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			return undefined
		})

		expect(() => rollback({})).rejects.toEqual(new Error('No migrations present in db!'))
		expect(mocks.updateRollback).toBeCalledTimes(0)
		expect(mocks.migrateDown).toBeCalledTimes(0)
	})
})

describe('runMigration', () => {
	test('runs migration', async () => {
		await runMigration({}, 1)
		expect(mocks.insertMigration).toBeCalledTimes(1)
		expect(mocks.migrateUp).toBeCalledTimes(1)
	})

	test("migration doesn't exist", async () => {
		expect(() => runMigration({}, 999)).rejects.toEqual(new Error("Migration doesn't exist!"))

		expect(mocks.insertMigration).toBeCalledTimes(0)
		expect(mocks.migrateUp).toBeCalledTimes(0)
	})
})

describe('rollbackMigration', () => {
	test('rolls back migration', async () => {
		await rollbackMigration({}, 1)
		expect(mocks.updateRollback).toBeCalledTimes(1)
		expect(mocks.migrateDown).toBeCalledTimes(1)
	})

	test("migration doesn't exist", async () => {
		expect(() => rollbackMigration({}, 999)).rejects.toEqual(new Error("Migration doesn't exist!"))

		expect(mocks.updateRollback).toBeCalledTimes(0)
		expect(mocks.migrateDown).toBeCalledTimes(0)
	})
})
