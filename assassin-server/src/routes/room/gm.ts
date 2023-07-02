import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, findPlayer, findRoomGM, listPlayersInRoom, setGMStatus } from '../../tables/player'
import { createRoomsTable, findRoom } from '../../tables/room'

export const AssignGM = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room, name } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)
		await createPlayerTable(db)

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		// Unassign GM status
		const currentGM = await findRoomGM(db, room)
		if (currentGM) {
			await setGMStatus(db, room, currentGM.name, false)
		}

		// Reassign GM status
		if (!name) {
			const players = await listPlayersInRoom(db, room)

			if (players && players.length > 1) {
				const otherPlayers = players!.filter((p) => !p.isGM)
				await setGMStatus(db, room, otherPlayers[0].name, true)
			}
		} else {
			const playerRecord = await findPlayer(db, name, room)
			if (!playerRecord) {
				return c.json({ message: 'Player not found!' }, 404)
			}

			await setGMStatus(db, room, name, true)
		}

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
