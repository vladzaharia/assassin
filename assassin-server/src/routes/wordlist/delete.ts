import { Context } from 'hono'
import { Bindings } from '../../types'
import { createWordListTable, deleteWordList, findWordList } from '../../tables/wordlist'
import { createWordTable, deleteWord, listWordsInWordList } from '../../tables/word'

export const DeleteWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 tables if needed
		await createWordListTable(db)
		await createWordTable(db)

		// Try to find word list
		const record = await findWordList(db, list)
		if (!record) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Delete all words for word list
		const words = await listWordsInWordList(db, list)
		for (const word of words) {
			await deleteWord(db, word.word, word.list)
		}

		// Delete word list
		await deleteWordList(db, list)
		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
