import { Context } from 'hono'
import { Bindings } from '../../types'
import { createWordListTable, listWordLists } from '../../tables/wordlist'

export const ListWordLists = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createWordListTable(db)

		const records = await listWordLists(db)

		return c.json({ wordlists: records.results ? records.results.map((r) => r.name) : [] })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
