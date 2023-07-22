import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { deletePlayersInRoom } from '../../tables/player'
import { findRoom, setStatus } from '../../tables/room'

export const ResetGame = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Try to find room
		const record = await findRoom(db, room)
		if (!record) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		await deletePlayersInRoom(db, room)
		await setStatus(db, room, 'not-ready')
		return c.json({ message: 'Room reset successfully!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
