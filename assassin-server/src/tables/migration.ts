import { getKyselyDb } from './db'

export async function createMigrationTable(db: D1Database) {
	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS migration (version NUMBER NOT NULL, name TEXT NOT NULL, applied NUMBER NOT NULL, rolledBack NUMBER);`)
	console.info(`Create word table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function dropMigrationTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS migration`)
	console.info(`Drop word table => dropTableResult ${dropTableResult.error || dropTableResult.success}`)

	return dropTableResult
}

export async function listMigrations(db: D1Database) {
	return await getKyselyDb(db).selectFrom('migration').selectAll().execute()
}

export async function getCurrentMigration(db: D1Database) {
	return (await getKyselyDb(db).selectFrom('migration').selectAll().where('rolledBack', '=', undefined).orderBy('applied').limit(1).execute())[0]
}

export async function applyMigration(db: D1Database, version: number, name: string) {
	return await getKyselyDb(db)
		.insertInto('migration')
		.values({
			version,
			name,
			applied: Date.now()
		})
		.execute()
}

export async function revertMigration(db: D1Database, version: number) {
	return await getKyselyDb(db)
		.updateTable('migration')
		.set({
			rolledBack: Date.now()
		})
		.where(({ and, cmpr }) => and([cmpr('version', '=', version), cmpr('rolledBack', '=', undefined)]))
		.execute()
}
