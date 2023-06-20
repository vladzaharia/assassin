import { Context } from 'hono'
import { AssassinRecord, Bindings } from '../types'

export const AddPlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name } = c.req.param()

		const record = await c.env.D1DATABASE.prepare(`SELECT * FROM assassin WHERE name=?`)
		.bind(name)
		.first<AssassinRecord>()

		if (!record) {
			const insertResult = await c.env.D1DATABASE.prepare(`INSERT INTO assassin (name) VALUES(?)`)
				.bind(name)
				.run()
			console.info(`Create table => createTableResult ${insertResult.error || insertResult.success}`)

			if (insertResult.success) {
				return c.json({ message: 'ok' })
			} else {
				return c.json({ message: 'Something went wrong!', error: insertResult.error }, 500)
			}
		} else {
			return c.json({ message: 'Player already exists!' }, 400)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
