import { Context } from 'hono'
import { Bindings } from '../../types'
import { createPlayerTable as createPlayerTable, findPlayer as findPlayer, insertPlayer } from '../../tables/player'
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
		const record = await findPlayer(db, name, room)
		if (record) {
			return c.json({ message: 'Player already exists!' }, 400)
		}

		const insertResult = await insertPlayer(db, name, room)
		if (insertResult.success) {
			return c.json({ message: 'ok' })
		} else {
			return c.json({ message: 'Something went wrong!', error: insertResult.error }, 500)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
