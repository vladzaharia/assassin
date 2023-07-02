import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, listPlayersInRoom } from '../../tables/player'
import { createRoomsTable, findRoom } from '../../tables/room'
import { getRoomStatus } from '../../util'
import { PlayerTable } from '../../tables/db'

const buildPlayerRecords = (players: PlayerTable[]) => {
	return [...players.filter((p) => p.isGM), ...players.filter((p) => !p.isGM)].map((p) => {
		return { name: p.name, isGM: p.isGM === 1, status: p.status }
	})
}

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
		const playerRecords = await listPlayersInRoom(db, room)

		return c.json({
			name: roomRecord.name,
			status: getRoomStatus(playerRecords),
			players: buildPlayerRecords(playerRecords),
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
