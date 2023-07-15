import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, deletePlayer, findPlayer, listPlayersInRoom, setGMStatus } from '../../tables/player'
import { createRoomsTable, findRoom } from '../../tables/room'

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
		const playerRecord = await findPlayer(db, room, name)
		if (!playerRecord) {
			return c.json({ message: 'Player not found!' }, 404)
		}

		// Check if game has already started
		if (roomRecord.status === 'started') {
			return c.json({ message: 'Game has already started!' }, 400)
		}

		// Reassign GM status
		if (playerRecord.isGM) {
			const players = await listPlayersInRoom(db, room)

			if (players && players.length > 1) {
				const otherPlayers = players!.filter((p) => !p.isGM)
				await setGMStatus(db, room, otherPlayers[0].name, true)
			}
		}

		await deletePlayer(db, room, name)
		return c.json({ message: `Successfully left ${room} room!` })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
