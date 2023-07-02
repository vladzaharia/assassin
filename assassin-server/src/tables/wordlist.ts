import { getKyselyDb } from './db'

export async function createWordListTable(db: D1Database) {
	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS wordlist (name TEXT PRIMARY KEY, description TEXT NOT NULL, icon TEXT);`)
	console.info(`Create word list table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function dropWordListTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS wordlist`)
	console.info(`Drop word list table => dropTableResult ${dropTableResult.error || dropTableResult.success}`)

	return dropTableResult
}

export async function listWordLists(db: D1Database) {
	return await getKyselyDb(db).selectFrom('wordlist').selectAll().execute()
}

export async function findWordList(db: D1Database, name: string) {
	return await getKyselyDb(db).selectFrom('wordlist').selectAll().where('name', '=', name).executeTakeFirst()
}

export async function insertWordList(db: D1Database, name: string, description: string, icon?: string) {
	return await getKyselyDb(db)
		.insertInto('wordlist')
		.values({
			name,
			description,
		})
		.execute()
}

export async function deleteWordList(db: D1Database, name: string) {
	return await getKyselyDb(db).deleteFrom('wordlist').where('name', '=', name).execute()
}
