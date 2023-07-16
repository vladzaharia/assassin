import { getKyselyDb } from './db'
import { createWordListTable } from './wordlist'

export async function createWordTable(db: D1Database) {
	// Create wordlist table first
	await createWordListTable(db)

	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS word (word TEXT NOT NULL, list TEXT NOT NULL, UNIQUE(word, list), FOREIGN KEY(list) REFERENCES wordlist(name));`)
	console.info(`Create word table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function dropWordTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS word`)
	console.info(`Drop word table => dropTableResult ${dropTableResult.error || dropTableResult.success}`)

	return dropTableResult
}

export async function listWords(db: D1Database) {
	return await getKyselyDb(db).selectFrom('word').selectAll().execute()
}

export async function listWordsInWordList(db: D1Database, list: string) {
	return await getKyselyDb(db).selectFrom('word').selectAll().where('list', '=', list).execute()
}

export async function listWordsInWordLists(db: D1Database, lists: string[]) {
	console.log(`list words in ${lists}`)
	return await getKyselyDb(db).selectFrom('word').selectAll().where('list', 'in', lists).execute()
}

export async function findWord(db: D1Database, list: string, word: string) {
	return await getKyselyDb(db)
		.selectFrom('word')
		.selectAll()
		.where(({ and, cmpr }) => and([cmpr('word', '=', word), cmpr('list', '=', list)]))
		.executeTakeFirst()
}

export async function insertWord(db: D1Database, list: string, word: string) {
	return await getKyselyDb(db)
		.insertInto('word')
		.values({
			word,
			list,
		})
		.execute()
}

export async function insertWords(db: D1Database, list: string, words: string[]) {
	if (words.length > 0) {
		const wordsCopy = words.slice()

		while (wordsCopy.length > 0) {
			await getKyselyDb(db)
				.insertInto('word')
				.values(
					wordsCopy.splice(0, 25).map((word) => {
						return {
							word,
							list,
						}
					})
				)
				.execute()
		}
	}
}

export async function deleteWord(db: D1Database, list: string, word: string) {
	return await getKyselyDb(db)
		.deleteFrom('word')
		.where(({ and, cmpr }) => and([cmpr('word', '=', word), cmpr('list', '=', list)]))
		.execute()
}

export async function deleteWords(db: D1Database, list: string, words: string[]) {
	return await getKyselyDb(db)
		.deleteFrom('word')
		.where(({ and, cmpr }) => and([cmpr('word', 'in', words), cmpr('list', '=', list)]))
		.execute()
}

export async function deleteWordsInWordList(db: D1Database, list: string) {
	return await getKyselyDb(db).deleteFrom('word').where('list', '=', list).execute()
}
