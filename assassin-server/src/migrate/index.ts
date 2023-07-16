import { insertMigration, getCurrentMigration, updateRollback } from '../tables/migration'
import { MIGRATION_0_INITIAL } from './migrations/0-initial'
import { Migration } from './types'

export const MIGRATIONS: Migration[] = [MIGRATION_0_INITIAL]

export const getAvailableMigrations = async (db: D1Database) => {
	const currentMigration = await getCurrentMigration(db)

	const getMigrationDetails = (migration: Migration) => {
		return {
			version: migration.version,
			name: migration.name,
		}
	}

	if (!currentMigration) {
		return MIGRATIONS.map(getMigrationDetails)
	} else {
		return MIGRATIONS.filter((m) => m.version > currentMigration.version).map(getMigrationDetails)
	}
}

export const runAllMigrations = async (db: D1Database) => {
	console.log(`Applying all migrations...`)

	for (const migration of MIGRATIONS) {
		await runMigration(db, migration.version)
	}
}

export const rollbackAllMigrations = async (db: D1Database) => {
	console.log(`Rolling back all migrations...`)

	for (const migration of MIGRATIONS.reverse()) {
		await rollbackMigration(db, migration.version)
	}
}

export const migrate = async (db: D1Database) => {
	const availableMigrations = await getAvailableMigrations(db)

	console.log(`Applying ${availableMigrations.length} migrations...`)

	for (const migration of availableMigrations) {
		await runMigration(db, migration.version)
	}
}

export const rollback = async (db: D1Database) => {
	const currentMigration = await getCurrentMigration(db)

	if (!currentMigration) {
		// No migration present, run through all
		throw new Error('No migrations present in db!')
	} else {
		await rollbackMigration(db, currentMigration.version)
	}
}

const runMigration = async (db: D1Database, version: number) => {
	const migration = MIGRATIONS.filter((m) => m.version === version)[0]
	if (!migration) {
		throw new Error("Migration doesn't exist!")
	}

	console.log(`Applying migration ${migration.version} - ${migration.name}`)
	await migration.up(db)

	// Commit migration to db
	await insertMigration(db, version, migration.name)
}

const rollbackMigration = async (db: D1Database, version: number) => {
	const migration = MIGRATIONS.filter((m) => m.version === version)[0]
	if (!migration) {
		throw new Error("Migration doesn't exist!")
	}

	console.log(`Rolling back migration ${migration.version} - ${migration.name}`)
	await migration.down(db)

	// Commit rollback to db
	await updateRollback(db, version)
}