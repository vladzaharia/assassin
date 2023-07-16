import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { getCurrentMigration, listMigrations } from '../../tables/migration'

export const DbInfo = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const migration = await getCurrentMigration(db)
		const appliedMigrations = await listMigrations(db)

		return c.json({
			current: migration,
			applied: appliedMigrations
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
