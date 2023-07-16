import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createWordListTable, listWordLists } from '../../tables/wordlist'
import { listWordsInWordList } from '../../tables/word'
import { AVAILABLE_WORDLISTS } from './importable'

interface ListWordListResponse {
	name: string
	icon?: string
	numWords: number
	managed: boolean
}

export const ListWordLists = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createWordListTable(db)

		const wordListResponses: ListWordListResponse[] = []
		const wordlists = await listWordLists(db)

		for (const wordlist of wordlists) {
			const words = await listWordsInWordList(db, wordlist.name)
			wordListResponses.push({
				name: wordlist.name,
				icon: wordlist.icon,
				numWords: words.length,
				managed: AVAILABLE_WORDLISTS.some((wl) => wl.name === wordlist.name),
			})
		}

		return c.json({ wordLists: wordListResponses })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
