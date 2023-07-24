import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { deleteWordsInWordList, insertWords } from '../../../tables/word'
import { deleteWordList, insertWordList } from '../../../tables/wordlist'
import { GetManagedWordlists } from '.'

export const ImportManagedWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const { importList: list } = c.req.param()

		const initialWordList = GetManagedWordlists().filter((wl) => wl.name === list)[0]

		// Check if wordlist exists
		if (!initialWordList) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Delete wordlist if it exists
		await deleteWordsInWordList(db, list)
		await deleteWordList(db, list)

		// Add wordlist with words
		await insertWordList(db, initialWordList.name, initialWordList.description, initialWordList.icon)
		await insertWords(db, initialWordList.name, initialWordList.words)

		return c.json({ message: 'Successfully imported word list!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
