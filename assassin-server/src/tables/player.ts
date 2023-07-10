import { PlayerStatus, getKyselyDb } from './db'

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
	return await getKyselyDb(db).selectFrom('player').selectAll().execute()
}

export async function listPlayersInRoom(db: D1Database, room: string) {
	return await getKyselyDb(db).selectFrom('player').selectAll().where('room', '=', room).orderBy('status', 'asc').execute()
}

export async function findPlayer(db: D1Database, name: string, room: string) {
	return await getKyselyDb(db)
		.selectFrom('player')
		.selectAll()
		.where(({ and, cmpr }) => and([cmpr('name', '=', name), cmpr('room', '=', room)]))
		.executeTakeFirst()
}

export async function findRoomGM(db: D1Database, room: string) {
	return await getKyselyDb(db)
		.selectFrom('player')
		.selectAll()
		.where(({ and, cmpr }) => and([cmpr('isGM', '=', 1), cmpr('room', '=', room)]))
		.executeTakeFirst()
}

export async function insertPlayer(db: D1Database, room: string, name: string, isGM = false) {
	return await getKyselyDb(db)
		.insertInto('player')
		.values({
			name,
			room,
			isGM: isGM ? 1 : 0,
			status: 'alive',
			words: JSON.stringify([]),
		})
		.execute()
}

export async function setTarget(db: D1Database, room: string, name: string, target: string) {
	return await getKyselyDb(db)
		.updateTable('player')
		.set({ target })
		.where(({ and, cmpr }) => and([cmpr('name', '=', name), cmpr('room', '=', room)]))
		.execute()
}

export async function setWords(db: D1Database, room: string, name: string, words: string[]) {
	return await getKyselyDb(db)
		.updateTable('player')
		.set({ words: JSON.stringify(words) })
		.where(({ and, cmpr }) => and([cmpr('name', '=', name), cmpr('room', '=', room)]))
		.execute()
}

export async function setStatus(db: D1Database, room: string, name: string, status: PlayerStatus) {
	return await getKyselyDb(db)
		.updateTable('player')
		.set({ status })
		.where(({ and, cmpr }) => and([cmpr('name', '=', name), cmpr('room', '=', room)]))
		.execute()
}

export async function setGMStatus(db: D1Database, room: string, name: string, isGM: boolean) {
	return await getKyselyDb(db)
		.updateTable('player')
		.set({ isGM: isGM ? 1 : 0 })
		.where(({ and, cmpr }) => and([cmpr('name', '=', name), cmpr('room', '=', room)]))
		.execute()
}

export async function deletePlayer(db: D1Database, room: string, name: string) {
	return await getKyselyDb(db)
		.deleteFrom('player')
		.where(({ and, cmpr }) => and([cmpr('name', '=', name), cmpr('room', '=', room)]))
		.execute()
}

export async function deletePlayersInRoom(db: D1Database, room: string) {
	return await getKyselyDb(db).deleteFrom('player').where('room', '=', room).execute()
}
