import { Context } from 'hono'
import { Bindings } from '../../types'
import { createPlayerTable, listPlayersInRoom } from '../../tables/player'
import { createRoomsTable, findRoom } from '../../tables/room'
import { getRoomStatus } from '../../util'

export const RoomStatus = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createPlayerTable(db)
		await createRoomsTable(db)

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		const records = (await listPlayersInRoom(db, room)).results

		if (records) {
			return c.json({
				status: getRoomStatus(records),
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
