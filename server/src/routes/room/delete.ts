import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, findRoom, deleteRoom } from '../../tables/room'
import { deletePlayersInRoom } from '../../tables/player'

export const DeleteRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		// Try to find room
		const record = await findRoom(db, room)
		if (!record) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		const deletePlayersResult = await deletePlayersInRoom(db, room)
		const deleteResult = await deleteRoom(db, room)

		if (deletePlayersResult.success && deleteResult.success) {
			return c.json({ message: 'ok' })
		} else {
			return c.json({ message: 'Something went wrong!', error: deleteResult.error }, 500)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
