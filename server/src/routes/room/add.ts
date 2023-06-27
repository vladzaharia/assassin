import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, findRoom, insertRoom } from '../../tables/room'

export const AddRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(c.env.D1DATABASE)

		const record = await findRoom(db, room)
		if (record) {
			return c.json({ message: 'Room already exists!' }, 400)
		}

		const insertResult = await insertRoom(db, room)

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
