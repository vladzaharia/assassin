import { Context } from 'hono'
import { Bindings } from '../../types'
import { createRoomsTable, findRoom } from '../../tables/room'
import { createPlayerTable, deletePlayer, findPlayer, listPlayersInRoom, setPlayerAsGM } from '../../tables/player'

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
			const players = (await listPlayersInRoom(db, room)).results

			if (players?.length || 0 > 1) {
				const otherPlayers = players!.filter((p) => !p.isGM)
				setPlayerAsGM(db, otherPlayers[0].name, room)
			}
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
