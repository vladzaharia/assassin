import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createRoomsTable, findRoom, setStatus, setUsesWords, setWordLists } from '../../tables/room'
import { RoomStatus } from '../../tables/db'
import { findWordList } from '../../tables/wordlist'

interface UpdateRoomBody {
	status?: RoomStatus
	usesWords?: boolean
	wordLists?: string[]
}

export const UpdateRoom = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const { status, usesWords, wordLists } = await c.req.json<UpdateRoomBody>()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		const record = await findRoom(db, room)
		if (!record) {
			return c.json({ message: 'Room does not exist!' }, 404)
		}

		if (status !== undefined) {
			await setStatus(db, room, status)
		}

		if (usesWords !== undefined) {
			await setUsesWords(db, room, usesWords)
		}

		if (wordLists !== undefined) {
			// Check if wordlists exist
			for (const list of wordLists) {
				const listRecord = await findWordList(db, list)
				if (!listRecord) {
					return c.json({ message: 'Word list does not exist!' }, 404)
				}
			}

			await setWordLists(db, room, wordLists)
		}

		return c.json({ message: 'Successfully updated room!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
