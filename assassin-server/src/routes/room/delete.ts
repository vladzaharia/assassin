import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, deletePlayersInRoom } from '../../tables/player'
import { createRoomsTable, deleteRoom, findRoom } from '../../tables/room'

export const DeleteRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)
		await createPlayerTable(db)

		// Try to find room
		const record = await findRoom(db, room)
		if (!record) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		await deletePlayersInRoom(db, room)
		await deleteRoom(db, room)

		return c.json({ message: 'Room deleted successfully!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
