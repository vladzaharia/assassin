import { applyMigration, revertMigration } from "../tables/migration"
import { MIGRATION_0_INITIAL } from "./migrations/0-initial"

export const MIGRATIONS = [MIGRATION_0_INITIAL]

export const runMigrations = async (db: D1Database) => {
	for (const migration of MIGRATIONS) {
		await runMigration(db, migration.version)
	}
}

export const rollbackMigrations = async (db: D1Database) => {
	for (const migration of MIGRATIONS) {
		await rollbackMigration(db, migration.version)
	}
}

export const runMigration = async (db: D1Database, version: number) => {
	const migration = MIGRATIONS.filter((m) => m.version === version)[0]
	if (!migration) {
		throw new Error("Migration doesn't exist!")
	}

	await migration.up(db)

	// Move version up
	await applyMigration(db, version, migration.name)
}

export const rollbackMigration = async (db: D1Database, version: number) => {
	const migration = MIGRATIONS.filter((m) => m.version === version)[0]
	if (!migration) {
		throw new Error("Migration doesn't exist!")
	}

	await migration.down(db)

	// Move version down
	await revertMigration(db, version)
}
