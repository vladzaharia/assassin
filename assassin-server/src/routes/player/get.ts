import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findPlayer } from '../../tables/player'
import { findRoom } from '../../tables/room'

export const GetPlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name, room } = c.req.param()
		const db = c.env.D1DATABASE

		// Check if room exists
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		const record = await findPlayer(db, room, name)
		if (!record) {
			return c.json({ message: 'Player not found!' }, 404)
		}

		const { isGM, ...recordProps } = record

		return c.json({
			...recordProps,
			words: JSON.parse(recordProps.words || '[]'),
			isGM: isGM === 1,
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
