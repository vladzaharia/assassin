import { getKyselyDb } from './db'

export async function dropWordListTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS wordlist`)
	console.info(`Drop word list table => dropTableResult ${dropTableResult.error || dropTableResult.success}`)

	return dropTableResult
}

export async function listWordLists(db: D1Database) {
	return await getKyselyDb(db).selectFrom('wordlist').selectAll().orderBy('name', 'asc').execute()
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
			icon,
		})
		.execute()
}

export async function setDescription(db: D1Database, name: string, description: string) {
	return await getKyselyDb(db)
		.updateTable('wordlist')
		.set({
			description,
		})
		.where('name', '=', name)
		.execute()
}

export async function setIcon(db: D1Database, name: string, icon: string) {
	return await getKyselyDb(db)
		.updateTable('wordlist')
		.set({
			icon,
		})
		.where('name', '=', name)
		.execute()
}

export async function deleteWordList(db: D1Database, name: string) {
	return await getKyselyDb(db).deleteFrom('wordlist').where('name', '=', name).execute()
}
