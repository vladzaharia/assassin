import { Context } from 'hono'
import { AssassinRecord, Bindings } from '../types'

export const GetPlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name } = c.req.param()

		const record = await c.env.D1DATABASE.prepare(`SELECT * FROM assassin WHERE name=?`).bind(name).first<AssassinRecord>()

		if (record) {
			return c.json(record)
		} else {
			return c.json({ message: 'Player not found!' }, 404)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
