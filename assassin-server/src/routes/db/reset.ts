import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { rollbackAllMigrations, runAllMigrations } from '../../migrate'
import { getCurrentMigration } from '../../tables/migration'

export const ResetDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const currentMigration = await getCurrentMigration(db)

		// Drop all tables
		await rollbackAllMigrations(db)

		// Run through all migrations
		await runAllMigrations(db)

		const newMigration = await getCurrentMigration(db)

		return c.json({
			message: 'Database reset successfully!',
			oldVersion: currentMigration?.version || -1,
			newVersion: newMigration?.version || -1,
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
