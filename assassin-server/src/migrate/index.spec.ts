import { vi } from 'vitest'
import { Migration } from './types'
import { getAvailableMigrations } from './index'

const TestMigrations = [
	{
		name: 'test-base-migration',
		version: 0,
		up: vi.fn(),
		down: vi.fn()
	},
	{
		name: 'test-first-migration',
		version: 1,
		up: vi.fn(),
		down: vi.fn()
	},
	{
		name: 'test-second-migration',
		version: 2,
		up: vi.fn(),
		down: vi.fn()
	},
]

const mocks = vi.hoisted(() => {
	return {
		getAllMigrations: vi.fn().mockImplementation(() => {
			return [
				{
					name: 'test-base-migration',
					version: 0,
					up: vi.fn(),
					down: vi.fn()
				},
				{
					name: 'test-first-migration',
					version: 1,
					up: vi.fn(),
					down: vi.fn()
				},
				{
					name: 'test-second-migration',
					version: 2,
					up: vi.fn(),
					down: vi.fn()
				}
			] as Migration[]
		}),
		getCurrentMigration: vi.fn().mockImplementation(() => {
			return {
				name: 'test-base-migration',
				version: 0,
				up: vi.fn(),
				down: vi.fn()
			} as Migration
		}),
	}
})

vi.mock('./migrations', () => {
	return {
		getAllMigrations: mocks.getAllMigrations
	}
})

vi.mock('../tables/migration', () => {
	return {
		getCurrentMigration: mocks.getCurrentMigration
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe("getAvailableMigrations", () => {
	test("Get migrations bigger than current version", async () => {
		const result = await getAvailableMigrations({})
		expect(result.length).toEqual(2)
		expect(result[0].name).toEqual(TestMigrations[1].name)
		expect(result[0].version).toEqual(TestMigrations[1].version)
		expect(result[1].name).toEqual(TestMigrations[2].name)
		expect(result[1].version).toEqual(TestMigrations[2].version)
	})

	test("Migrations reflect available ones", async () => {
		mocks.getAllMigrations.mockImplementationOnce(() => {
			return [ TestMigrations[2] ]
		})

		const result = await getAvailableMigrations({})
		expect(result.length).toEqual(1)
		expect(result[0].name).toEqual(TestMigrations[2].name)
		expect(result[0].version).toEqual(TestMigrations[2].version)
	})

	test("Migrations reflect current one", async () => {
		mocks.getCurrentMigration.mockImplementationOnce(() => {
			return TestMigrations[1]
		})

		const result = await getAvailableMigrations({})
		expect(result.length).toEqual(1)
		expect(result[0].name).toEqual(TestMigrations[2].name)
		expect(result[0].version).toEqual(TestMigrations[2].version)
	})

	test("Migrations when no current migration", async () => {
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

// describe("runAllMigrations", () => {

// })

// describe("rollbackAllMigrations", () => {

// })

// describe("migrate", () => {

// })

// describe("rollback", () => {

// })

// describe("runMigration", () => {

// })

// describe("rollbackMigration", () => {

// })
