import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { insertPlayer, listPlayersInRoom } from '../../tables/player'
import { findRoom } from '../../tables/room'

export const AddPlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name, room } = c.req.param()
		const db = c.env.D1DATABASE

		// Check if room exists
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		// Check if player exists
		const players = await listPlayersInRoom(db, room)
		if (players?.some((p) => p.name === name)) {
			return c.json({ message: 'Player already exists!' }, 400)
		} else if (roomRecord.status === 'started') {
			return c.json({ message: 'Game has already started!' }, 400)
		}

		await insertPlayer(db, room, name, players?.length === 0)
		return c.json({ message: `Successfully joined ${room} room!` })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
