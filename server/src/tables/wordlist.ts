import { WordListRecord } from '../types'

export async function createWordListTable(db: D1Database) {
	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS wordlist (name TEXT PRIMARY KEY, description TEXT NOT NULL);`)
	console.info(`Create word list => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function listWordLists(db: D1Database) {
	return await db.prepare(`SELECT * FROM wordlist`).all<WordListRecord>()
}

export async function insertWordList(db: D1Database, name: string, description: string) {
	const insertResult = await db.prepare(`INSERT INTO wordlist (name, description) VALUES(?, ?)`).bind(name, description).run()
	console.info(`Insert word list => insertResult ${insertResult.error || insertResult.success}`)

	return insertResult
}

export async function findWordList(db: D1Database, name: string) {
	return await db.prepare(`SELECT * FROM wordlist WHERE name=?`).bind(name).first<WordListRecord>()
}

export async function deleteWordList(db: D1Database, name: string) {
	const deleteRowsResult = await db.prepare(`DELETE FROM wordlist WHERE name=?`).bind(name).run()
	console.info(`Delete word list => deleteRowsResult ${deleteRowsResult.error || deleteRowsResult.success}`)

	return deleteRowsResult
}