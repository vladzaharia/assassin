import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, listRooms } from '../../tables/room'

export const ListRooms = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		const records = await listRooms(db)

		return c.json({ rooms: records.results ? records.results.map((r) => r.name) : [] })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
