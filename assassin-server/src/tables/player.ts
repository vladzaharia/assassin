import { PlayerRecord } from '../types'

export async function createPlayerTable(db: D1Database) {
	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS player (name TEXT, room TEXT, target TEXT, words BLOB, status TEXT, isGM INTEGER, UNIQUE(name, room));`)
	console.info(`Create player table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function dropPlayerTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS player`)
	console.info(`Drop player table => dropTableResult ${dropTableResult.error || dropTableResult.success}`)

return dropTableResult
}

export async function listPlayers(db: D1Database) {
	return await db.prepare(`SELECT * FROM player`).all<PlayerRecord>()
}

export async function listPlayersInRoom(db: D1Database, room: string) {
	return await db.prepare(`SELECT * FROM player WHERE room=?`).bind(room).all<PlayerRecord>()
}

export async function insertPlayer(db: D1Database, name: string, room: string, isGM = false) {
	const insertResult = await db.prepare(`INSERT INTO player (name, room, words, status, isGM) VALUES(?,?,?,'alive',?)`).bind(name, room, [], isGM ? 1 : 0).run()
	console.info(`Insert player => insertResult ${insertResult.error || insertResult.success}`)

	return insertResult
}

export async function findPlayer(db: D1Database, name: string, room: string) {
	return await db.prepare(`SELECT * FROM player WHERE name=? AND room=?`).bind(name, room).first<PlayerRecord>()
}

export async function setPlayerTarget(db: D1Database, name: string, room: string, target: string) {
	return await db.prepare(`UPDATE player SET target=? WHERE name=? AND room=?`).bind(target, name, room).run()
}

export async function setPlayerWords(db: D1Database, name: string, room: string, words: string[]) {
	return await db.prepare(`UPDATE player SET words=? WHERE name=? AND room=?`).bind(words, name, room).run()
}

export async function deletePlayer(db: D1Database, name: string, room: string) {
	const deleteRowsResult = await db.prepare(`DELETE FROM player WHERE name=? AND room=?`).bind(name, room).run()
	console.info(`Delete player => deleteRowsResult ${deleteRowsResult.error || deleteRowsResult.success}`)

	return deleteRowsResult
}

export async function deletePlayersInRoom(db: D1Database, room: string) {
	const deleteRowsResult = await db.prepare(`DELETE FROM player WHERE room=?`).bind(room).run()
	console.info(`Delete players in room => deleteRowsResult ${deleteRowsResult.error || deleteRowsResult.success}`)

	return deleteRowsResult
}
