import { getKyselyDb } from './db'
import { convertBoolToInt } from './util'

export async function createRoomsTable(db: D1Database) {
	const createTableResult = await db.exec(`
		CREATE TABLE IF NOT EXISTS room (name TEXT PRIMARY KEY, usesWords INTEGER);`)
	console.info(`Create room table => createTableResult ${createTableResult.error || createTableResult.success}`)

	return createTableResult
}

export async function dropRoomTable(db: D1Database) {
	const dropTableResult = await db.exec(`DROP TABLE IF EXISTS room`)
	console.info(`Drop room table => dropTableResult ${dropTableResult.error || dropTableResult.success}`)

	return dropTableResult
}

export async function listRooms(db: D1Database) {
	return await getKyselyDb(db).selectFrom('room').selectAll().execute()
}

export async function findRoom(db: D1Database, room: string) {
	return await getKyselyDb(db).selectFrom('room').selectAll().where('name', '=', room).executeTakeFirst()
}

export async function insertRoom(db: D1Database, room: string, usesWords = true) {
	return await getKyselyDb(db)
		.insertInto('room')
		.values({
			name: room,
			usesWords: convertBoolToInt(usesWords)
		})
		.execute()
}

export async function setUsesWords(db: D1Database, room: string, usesWords: boolean) {
	return await getKyselyDb(db)
		.updateTable('room')
		.set({
			usesWords: convertBoolToInt(usesWords)
		})
		.where('name', '=', room)
		.execute()
}

export async function deleteRoom(db: D1Database, room: string) {
	return await getKyselyDb(db)
		.deleteFrom('room')
		.where('name', '=', room)
}
