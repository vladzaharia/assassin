import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { getCurrentMigration, listMigrations } from '../../tables/migration'
import { getAvailableMigrations } from '../../migrate'

export const DbInfo = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const env = c.env.ENVIRONMENT

		const migration = await getCurrentMigration(db)
		const appliedMigrations = await listMigrations(db)
		const availableMigrations = await getAvailableMigrations(db)

		return c.json({
			binding: {
				type: 'Cloudflare D1',
				database: env === 'live' ? 'assassin' : `assassin-${env}`,
			},
			migrations: {
				current: migration,
				applied: appliedMigrations,
				available: availableMigrations.map((m) => {
					return { version: m.version, name: m.name }
				}),
			},
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
