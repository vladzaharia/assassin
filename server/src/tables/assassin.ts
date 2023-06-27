import { AssassinRecord } from '../types'

export async function createAssassinTable(db: D1Database) {
	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS assassin (name TEXT, room TEXT, target TEXT, words BLOB, status TEXT, UNIQUE(name, room));`)
	console.info(`Create table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function listAssassins(db: D1Database) {
	return await db.prepare(`SELECT * FROM assassin`).all<AssassinRecord>()
}

export async function listAssassinsInRoom(db: D1Database, room: string) {
	return await db.prepare(`SELECT * FROM assassin WHERE room=?`).bind(room).all<AssassinRecord>()
}

export async function insertAssassin(db: D1Database, name: string, room: string) {
	const insertResult = await db
		.prepare(`INSERT INTO assassin (name, room, words, status) VALUES(?,?,?, 'alive')`)
		.bind(name, room, [])
		.run()
	console.info(`Insert assassin => insertResult ${insertResult.error || insertResult.success}`)

	return insertResult
}

export async function findAssassin(db: D1Database, name: string, room: string) {
	return await db.prepare(`SELECT * FROM assassin WHERE name=? AND room=?`).bind(name, room).first<AssassinRecord>()
}

export async function setAssassinTarget(db: D1Database, name: string, room: string, target: string) {
	return await db.prepare(`UPDATE assassin SET target=? WHERE name=? AND room=?`).bind(target, name, room).run()
}

export async function setAssassinWords(db: D1Database, name: string, room: string, words: string[]) {
	return await db.prepare(`UPDATE assassin SET words=? WHERE name=? AND room=?`).bind(words, name, room).run()
}

export async function deleteAssassin(db: D1Database, name: string, room: string) {
	const deleteRowsResult = await db.prepare(`DELETE FROM assassin WHERE name=? AND room=?`).bind(name, room).run()
	console.info(`Delete assassin => deleteRowsResult ${deleteRowsResult.error || deleteRowsResult.success}`)

	return deleteRowsResult
}

export async function deleteAssassinsInRoom(db: D1Database, room: string) {
	const deleteRowsResult = await db.prepare(`DELETE FROM assassin WHERE room=?`).bind(room).run()
	console.info(`Delete assassins in room => deleteRowsResult ${deleteRowsResult.error || deleteRowsResult.success}`)

	return deleteRowsResult
}
