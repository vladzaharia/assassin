import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createWordListTable, findWordList, insertWordList } from '../../tables/wordlist'

interface AddWordListBody {
	description: string
	icon?: string
}

export const AddWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { list } = c.req.param()
		const { description, icon } = await c.req.json<AddWordListBody>()

		// Check if description is passed in
		if (!description) {
			return c.json({ message: 'Must set `description`!' }, 400)
		}

		// Create D1 table if needed
		await createWordListTable(db)

		// Try to find word list
		const record = await findWordList(db, list)
		if (record) {
			return c.json({ message: 'Word list already exists!' }, 400)
		}

		// Insert word list
		await insertWordList(db, list, description, icon)
		return c.json({ message: 'Successfully added word list!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
