import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { rollback } from '../../migrate'
import { getCurrentMigration } from '../../tables/migration'

export const RollbackDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const currentMigration = await getCurrentMigration(db)

		if (!currentMigration) {
			return c.json({ message: 'No migrations to roll back!' }, 400)
		} else if (currentMigration.version === 0) {
			return c.json({ message: "Can't roll back migration 0!" }, 400)
		}

		await rollback(db)

		const newMigration = await getCurrentMigration(db)

		return c.json({
			message: 'Migrations rolled back successfully!',
			oldVersion: currentMigration?.version,
			newVersion: newMigration?.version || -1,
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
