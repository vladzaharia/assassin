import { Context } from 'hono'
import { Bindings } from '../../types'
import { createWordListTable, findWordList } from '../../tables/wordlist'
import { createWordTable, listWordsInWordList } from '../../tables/word'

export const GetWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 tables if needed
		await createWordListTable(db)
		await createWordTable(db)

		// Try to find word list
		const wordListRecord = await findWordList(db, list)
		if (!wordListRecord) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Try to find words in word list
		const wordsRecord = (await listWordsInWordList(db, list)).results

		return c.json({
			name: wordListRecord.name,
			description: wordListRecord.description,
			words: wordsRecord?.map((w) => w.word),
		})
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}