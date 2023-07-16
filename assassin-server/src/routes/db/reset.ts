import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { dropMigrationTable } from '../../tables/migration'
import { dropRoomTable } from '../../tables/room'
import { dropPlayerTable } from '../../tables/player'
import { dropWordTable } from '../../tables/word'
import { dropWordListTable } from '../../tables/wordlist'

export const ResetDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Drop all tables
		await dropRoomTable(db)
		await dropPlayerTable(db)
		await dropWordTable(db)
		await dropWordListTable(db)
		await dropMigrationTable(db)

		return c.json({
			message: 'Database reset successfully!'
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
