import { WordRecord } from '../types'
import { createWordListTable } from './wordlist'

export async function createWordTable(db: D1Database) {
	// Create wordlist table first
	await createWordListTable(db)

	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS word (word TEXT NOT NULL, list TEXT NOT NULL, UNIQUE(word, list), FOREIGN KEY(list) REFERENCES wordlist(name));`)
	console.info(`Create word table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function listWords(db: D1Database) {
	return await db.prepare(`SELECT * FROM word`).all<WordRecord>()
}

export async function listWordsInWordList(db: D1Database, list: string) {
	return await db.prepare(`SELECT * FROM word where list=?`).bind(list).all<WordRecord>()
}

export async function insertWord(db: D1Database, word: string, list: string) {
	const insertResult = await db.prepare(`INSERT INTO word (word, list) VALUES(?, ?)`).bind(word, list).run()
	console.info(`Insert word => insertResult ${insertResult.error || insertResult.success}`)

	return insertResult
}

export async function findWord(db: D1Database, word: string, list: string) {
	return await db.prepare(`SELECT * FROM word WHERE word=? AND list=?`).bind(word, list).first<WordRecord>()
}

export async function deleteWord(db: D1Database, word: string, list: string) {
	const deleteRowsResult = await db.prepare(`DELETE FROM word WHERE word=? AND list=?`).bind(word, list).run()
	console.info(`Delete word => deleteRowsResult ${deleteRowsResult.error || deleteRowsResult.success}`)

	return deleteRowsResult
}
