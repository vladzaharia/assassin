import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, findRoom } from '../../tables/room'
import { createPlayerTable, deletePlayer } from '../../tables/player'

export const DeletePlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name, room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)
		await createPlayerTable(db)

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		const deleteResult = await deletePlayer(db, name, room)

		if (deleteResult.success) {
			return c.json({ message: 'ok' })
		} else {
			return c.json({ message: 'Something went wrong!', error: deleteResult.error }, 500)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
