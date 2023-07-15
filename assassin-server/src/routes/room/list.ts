import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createRoomsTable, listRooms } from '../../tables/room'
import { RoomStatus } from '../../tables/db'
import { listPlayersInRoom } from '../../tables/player'
import { getRoomStatus } from '../../util'

interface ListRoomsResponse {
	name: string
	status: RoomStatus | 'ready'
	numPlayers: number
	usesWords: boolean
	numWordLists: number
}

export const ListRooms = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		const rooms = await listRooms(db)
		const listRoomsResponses: ListRoomsResponse[] = []

		for (const room of rooms) {
			const players = await listPlayersInRoom(db, room.name)
			listRoomsResponses.push({
				name: room.name,
				status: getRoomStatus(room.status, players),
				numPlayers: players.length,
				usesWords: room.usesWords === 1,
				numWordLists: JSON.parse(room.wordlists).length,
			})
		}

		return c.json({ rooms: listRoomsResponses })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
