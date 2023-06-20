import { Context } from 'hono'
import { AssassinRecord, Bindings } from '../types'

export const GameStatus = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		// Create D1 table if needed
		const createTableResult = await c.env.D1DATABASE.exec(`
		CREATE TABLE IF NOT EXISTS assassin (name TEXT, target TEXT, PRIMARY KEY(name));`)
		console.info(`Create table => createTableResult ${createTableResult.error || createTableResult.success}`)

		const records = (await c.env.D1DATABASE.prepare(`SELECT * FROM assassin`)
				.all<AssassinRecord>()).results

		if (records) {
			return c.json({
				status: records[0]?.target ? 'started' :
					records.length > 1 ? 'ready' :
						'not-ready',
				players: records.map((r) => r.name)
			})
		} else {
			return c.json({ status: 'not-ready', players: 0 })
		}

	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
