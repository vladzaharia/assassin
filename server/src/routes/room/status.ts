import { Context } from 'hono'
import { AssassinRecord, Bindings } from '../../types'
import { createAssassinTable, listAssassinsInRoom } from '../../tables/assassin'
import { createRoomsTable, findRoom } from '../../tables/room'

export const GameStatus = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createAssassinTable(db)
		await createRoomsTable(db)

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		const records = (await listAssassinsInRoom(db, room)).results

		if (records) {
			return c.json({
				status: records[0]?.target ? 'started' : records.length > 1 ? 'ready' : 'not-ready',
				players: records.map((r) => r.name),
			})
		} else {
			return c.json({ status: 'not-ready', players: 0 })
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
