import { createMigrationTable } from '../../tables/migration'
import { dropPlayerTable } from '../../tables/player'
import { dropRoomTable } from '../../tables/room'
import { dropWordTable } from '../../tables/word'
import { dropWordListTable } from '../../tables/wordlist'
import { Migration } from '../types'

export const MIGRATION_0_INITIAL: Migration = {
	version: 0,
	name: 'initial-migration',
	up: async (db: D1Database) => {
		await db.exec(
			`CREATE TABLE IF NOT EXISTS room (name TEXT PRIMARY KEY, status TEXT, usesWords INTEGER, numWords INTEGER, wordlists TEXT);`
		)
		await db.exec(
			`CREATE TABLE IF NOT EXISTS player (name TEXT, room TEXT, target TEXT, words BLOB, status TEXT, isGM INTEGER, UNIQUE(name, room));`
		)
		await db.exec(`CREATE TABLE IF NOT EXISTS wordlist (name TEXT PRIMARY KEY, description TEXT NOT NULL, icon TEXT);`)
		await db.exec(
			`CREATE TABLE IF NOT EXISTS word (word TEXT NOT NULL, list TEXT NOT NULL, UNIQUE(word, list), FOREIGN KEY(list) REFERENCES wordlist(name));`
		)
		await createMigrationTable(db)
	},
	down: async (db: D1Database) => {
		await dropPlayerTable(db)
		await dropRoomTable(db)
		await dropWordTable(db)
		await dropWordListTable(db)
	},
}
