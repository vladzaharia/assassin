import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { insertWords } from '../../../tables/word'
import { findWordList } from '../../../tables/wordlist'

interface AddWordsToListBody {
	words: string[]
}

export const AddWords = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const { words } = await c.req.json<AddWordsToListBody>()
		const db = c.env.D1DATABASE

		// Check if words are provided
		if (!words || words.length === 0) {
			return c.json({ message: 'Must provide `words` array!' }, 400)
		}

		// Try to find word list
		const wordListRecord = await findWordList(db, list)
		if (!wordListRecord) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Insert all words
		await insertWords(db, list, words)

		return c.json({ message: 'Successfully added words!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
