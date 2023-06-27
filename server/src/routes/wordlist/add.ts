import { Context } from 'hono'
import { Bindings } from '../../types'
import { createWordListTable, findWordList, insertWordList } from '../../tables/wordlist'

interface AddWordListBody {
	description: string
}

export const AddWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE
		const { list } = c.req.param()
		const { description } = await c.req.json<AddWordListBody>()

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
		const insertResult = await insertWordList(db, list, description)
		if (insertResult.success) {
			return c.json({ message: 'ok' })
		} else {
			return c.json({ message: 'Something went wrong!', error: insertResult.error }, 500)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
