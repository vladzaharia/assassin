import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, findRoom } from '../../tables/room'
import { createPlayerTable, listPlayersInRoom } from '../../tables/player'
import { getRoomStatus } from '../../util'

export const GetRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)
		await createPlayerTable(db)

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		// Find players in room
		const playerRecords = (await listPlayersInRoom(db, room)).results || []

		return c.json({
			name: roomRecord.name,
			status: getRoomStatus(playerRecords),
			players: playerRecords.map((p) => { return { name: p.name, isGM: p.isGM === 1, status: p.status }}),
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
