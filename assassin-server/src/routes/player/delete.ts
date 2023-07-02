import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, findRoom } from '../../tables/room'
import { createPlayerTable, deletePlayer, findPlayer, listPlayersInRoom, setGMStatus } from '../../tables/player'

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

		// Try to find player
		const playerRecord = await findPlayer(db, name, room)
		if (!playerRecord) {
			return c.json({ message: 'Player not found!' }, 404)
		}

		// Reassign GM status
		if (playerRecord.isGM) {
			const players = await listPlayersInRoom(db, room)

			if (players && players.length > 1) {
				const otherPlayers = players!.filter((p) => !p.isGM)
				await setGMStatus(db, otherPlayers[0].name, room, true)
			}
		}

		await deletePlayer(db, name, room)
		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
