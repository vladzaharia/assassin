import { RoomRecord } from '../types'

export async function createRoomsTable(db: D1Database) {
	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS room (name TEXT, words BLOB, PRIMARY KEY(name));`)
	console.info(`Create room table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function listRooms(db: D1Database) {
	return await db.prepare(`SELECT * FROM room`).all<RoomRecord>()
}

export async function insertRoom(db: D1Database, room: string) {
	const insertResult = await db.prepare(`INSERT INTO room (room, words) VALUES(?,?)`).bind(room, []).run()
	console.info(`Insert room => insertResult ${insertResult.error || insertResult.success}`)

	return insertResult
}

export async function findRoom(db: D1Database, room: string) {
	return await db.prepare(`SELECT * FROM room WHERE name=?`).bind(room).first<RoomRecord>()
}

export async function setRoomWords(db: D1Database, room: string, words: string[]) {
	return await db.prepare(`UPDATE room SET words=? WHERE name=?`).bind(words, room).run()
}

export async function deleteRoom(db: D1Database, room: string) {
	const deleteRowsResult = await db.prepare(`DELETE FROM room WHERE name=?`).bind(room).run()
	console.info(`Delete room => deleteRowsResult ${deleteRowsResult.error || deleteRowsResult.success}`)

	return deleteRowsResult
}
