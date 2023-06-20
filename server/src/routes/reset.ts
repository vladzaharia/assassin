import { Context } from 'hono'
import { Bindings } from '../types'

export const ResetGame = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		// Create D1 table if needed
		const createTableResult = await c.env.D1DATABASE.exec(`
			CREATE TABLE IF NOT EXISTS assassin (name TEXT, target TEXT, PRIMARY KEY(name));`)
		console.info(`Create table => createTableResult ${createTableResult.error || createTableResult.success}`)

		const deleteAllRowsResult = await c.env.D1DATABASE.exec(`DELETE FROM assassin`)
		console.info(`Delete rows => deleteAllRowsResult ${deleteAllRowsResult.error || deleteAllRowsResult.success}`)

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
