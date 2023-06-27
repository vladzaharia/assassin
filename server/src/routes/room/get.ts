import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, findRoom } from '../../tables/room'
import { listPlayersInRoom } from '../../tables/player'

export const GetRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		// Find players in room
		const playerRecords = (await listPlayersInRoom(db, room)).results || []

		return c.json({
			name: roomRecord.name,
			words: JSON.parse(roomRecord.words),
			players: playerRecords.map((p => p.name))
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
