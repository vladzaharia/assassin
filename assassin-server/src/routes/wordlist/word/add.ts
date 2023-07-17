import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { findWord, insertWord } from '../../../tables/word'
import { findWordList } from '../../../tables/wordlist'

export const AddWord = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list, word } = c.req.param()
		const db = c.env.D1DATABASE

		// Try to find word list
		const wordListRecord = await findWordList(db, list)
		if (!wordListRecord) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Check if word exists
		const wordRecord = await findWord(db, list, word)
		if (wordRecord) {
			return c.json({ message: 'Word already exists!' }, 400)
		}

		// Insert word
		await insertWord(db, list, word)

		return c.json({ message: 'Successfully added word!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
