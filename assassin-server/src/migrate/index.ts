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

	console.log(`Applying migration ${migration.version} - ${migration.name}`)
	await migration.up(db)

	console.log(`Applying successful!`)
	await applyMigration(db, version, migration.name)
}

export const rollbackMigration = async (db: D1Database, version: number) => {
	const migration = MIGRATIONS.filter((m) => m.version === version)[0]
	if (!migration) {
		throw new Error("Migration doesn't exist!")
	}

	console.log(`Rolling back migration ${migration.version} - ${migration.name}`)
	await migration.down(db)

	console.log(`Rollback successful!`)
	await revertMigration(db, version)
}
