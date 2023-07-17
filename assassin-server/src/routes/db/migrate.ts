import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { getAvailableMigrations, migrate } from '../../migrate'
import { getCurrentMigration } from '../../tables/migration'

export const MigrateDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		if ((await getAvailableMigrations(db)).length === 0) {
			return c.json({ message: 'No migrations to apply!' }, 400)
		}

		const oldVersion = (await getCurrentMigration(db))?.version || -1
		await migrate(db)
		const newVersion = (await getCurrentMigration(db))?.version || -1

		return c.json({ message: 'Migrations applied successfully!', oldVersion, newVersion })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
