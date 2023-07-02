import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createRoomsTable, findRoom, insertRoom } from '../../tables/room'

interface AddRoomBody {
	usesWords?: boolean
}

export const AddRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const { usesWords } = await c.req.json<AddRoomBody>()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		const record = await findRoom(db, room)
		if (record) {
			return c.json({ message: 'Room already exists!' }, 400)
		}

		await insertRoom(db, room, usesWords)
		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
