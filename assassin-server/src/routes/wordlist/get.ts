import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { listWordsInWordList } from '../../tables/word'
import { findWordList } from '../../tables/wordlist'
import { MANAGED_WORDLISTS } from './managed'

export const GetWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const db = c.env.D1DATABASE

		// Try to find word list
		const wordListRecord = await findWordList(db, list)
		if (!wordListRecord) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Try to find words in word list
		const wordsRecord = await listWordsInWordList(db, list)

		return c.json({
			name: wordListRecord.name,
			description: wordListRecord.description,
			words: wordsRecord?.map((w) => w.word),
			icon: wordListRecord.icon,
			managed: MANAGED_WORDLISTS.some((wl) => wl.name === wordListRecord.name),
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
