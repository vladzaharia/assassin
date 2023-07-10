import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, findPlayer } from '../../tables/player'
import { createRoomsTable, findRoom } from '../../tables/room'

export const GetPlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name, room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createPlayerTable(db)
		await createRoomsTable(db)

		// Check if room exists
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		const record = await findPlayer(db, name, room)
		if (!record) {
			return c.json({ message: 'Player not found!' }, 404)
		}

		const { isGM, ...recordProps } = record

		return c.json({
			...recordProps,
			isGM: isGM === 1,
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
