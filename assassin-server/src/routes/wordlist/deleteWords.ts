import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createWordTable, deleteWord } from '../../tables/word'
import { createWordListTable, findWordList } from '../../tables/wordlist'

interface DeleteWordsFromListBody {
	words: string[]
}

export const DeleteWordsFromList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const { words } = await c.req.json<DeleteWordsFromListBody>()

		const db = c.env.D1DATABASE

		// Create D1 tables if needed
		await createWordListTable(db)
		await createWordTable(db)

		// Try to find word list
		const record = await findWordList(db, list)
		if (!record) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Delete all words from word list
		for (const word of words) {
			await deleteWord(db, word, list)
		}

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
