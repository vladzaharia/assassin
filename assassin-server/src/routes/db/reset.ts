import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { rollbackMigrations, runMigrations } from '../../migrate'

export const ResetDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Drop all tables
		await rollbackMigrations(db)

		// Run through all migrations
		await runMigrations(db)

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
