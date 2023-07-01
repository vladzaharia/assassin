import { Context } from 'hono'
import { Bindings } from '../../types'
import { createPlayerTable, insertPlayer } from '../../tables/player'
import { createRoomsTable, insertRoom } from '../../tables/room'
import { createWordTable } from '../../tables/word'
import { createWordListTable } from '../../tables/wordlist'

export const DemoDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const { room: roomParam, name: nameParam } = c.req.query()
		const room = roomParam || "test"
		const name = nameParam || "Test"

		// Create D1 tables if needed
		await createRoomsTable(db)
		await createPlayerTable(db)
		await createWordListTable(db)
		await createWordTable(db)

		// Insert demo room
		await insertRoom(db, room)
		await insertPlayer(db, name, room, true)
		await insertPlayer(db, "Foo", room)
		await insertPlayer(db, "Bar", room)
		await insertPlayer(db, "Baz", room)

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
