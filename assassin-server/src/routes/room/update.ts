import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createRoomsTable, findRoom, setUsesWords } from '../../tables/room'

interface UpdateRoomBody {
	usesWords?: boolean
}

export const UpdateRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const { usesWords } = await c.req.json<UpdateRoomBody>()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		const record = await findRoom(db, room)
		if (!record) {
			return c.json({ message: 'Room does not exist!' }, 404)
		}

		if (usesWords) {
			await setUsesWords(db, room, usesWords)
		}

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
