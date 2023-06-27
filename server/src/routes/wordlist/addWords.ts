import { Context } from 'hono'
import { Bindings } from '../../types'
import { createWordListTable, findWordList } from '../../tables/wordlist'
import { createWordTable, insertWord } from '../../tables/word'

interface AddWordsToListBody {
	words: string[]
}

export const AddWordsToList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const { words } = await c.req.json<AddWordsToListBody>()
		const db = c.env.D1DATABASE

		// Check if words are provided
		if (!words || words.length === 0) {
			return c.json({ message: 'Must provide `words` array!' }, 400)
		}

		// Create D1 table if needed
		await createWordListTable(db)
		await createWordTable(db)

		// Try to find word lise
		const wordListRecord = await findWordList(db, list)
		if (!wordListRecord) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Insert each word
		for (const word of words) {
			await insertWord(db, word, list)
		}

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
