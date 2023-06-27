import { Context } from 'hono'
import { Bindings } from '../../types'
import { createAssassinTable as createAssassinTable, findAssassin as findAssassin, insertAssassin } from '../../tables/assassin'
import { createRoomsTable, findRoom } from '../../tables/room'

export const AddPlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name, room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 tables if needed
		await createAssassinTable(db)
		await createRoomsTable(db)

		// Check if room exists
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		// Check if player exists
		const record = await findAssassin(db, name, room)
		if (record) {
			return c.json({ message: 'Player already exists!' }, 400)
		}

		const insertResult = await insertAssassin(db, name, room)
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
