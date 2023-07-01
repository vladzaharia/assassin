import { Context } from 'hono'
import { Bindings } from '../../types'
import { createPlayerTable, dropPlayerTable } from '../../tables/player'
import { createRoomsTable, dropRoomTable } from '../../tables/room'
import { createWordTable, dropWordTable } from '../../tables/word'
import { createWordListTable, dropWordListTable } from '../../tables/wordlist'

export const ResetDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Drop D1 tables if needed
		await dropPlayerTable(db)
		await dropRoomTable(db)
		await dropWordTable(db)
		await dropWordListTable(db)

		// Create D1 tables if needed
		await createRoomsTable(db)
		await createPlayerTable(db)
		await createWordListTable(db)
		await createWordTable(db)

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
