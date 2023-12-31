import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { listPlayersInRoom } from '../../tables/player'
import { findRoom } from '../../tables/room'
import { getRoomStatus } from '../../util'
import { PlayerTable } from '../../tables/db'

const buildPlayerRecords = (players: PlayerTable[]) => {
	return [...players.filter((p) => p.isGM), ...players.filter((p) => !p.isGM)].map((p) => {
		return { name: p.name, isGM: p.isGM === 1, status: p.status }
	})
}

export const GetRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		// Find players in room
		const playerRecords = await listPlayersInRoom(db, room)

		return c.json({
			name: roomRecord.name,
			status: getRoomStatus(roomRecord.status, playerRecords),
			players: buildPlayerRecords(playerRecords),
			usesWords: roomRecord.usesWords === 1,
			numWords: roomRecord.numWords,
			wordLists: roomRecord.wordlists ? JSON.parse(roomRecord.wordlists) : [],
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
