import { Context } from 'hono'
import { Bindings } from '../../types'
import { createPlayerTable, insertPlayer, listPlayersInRoom } from '../../tables/player'
import { createRoomsTable, findRoom } from '../../tables/room'

export const AddPlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name, room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 tables if needed
		await createPlayerTable(db)
		await createRoomsTable(db)

		// Check if room exists
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		// Check if player exists
		const players = await listPlayersInRoom(db, room)
		if (players?.some((p) => p.name === name)) {
			return c.json({ message: 'Player already exists!' }, 400)
		}

		await insertPlayer(db, name, room, players?.length === 0)
		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
