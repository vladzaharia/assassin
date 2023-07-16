import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { listWordLists } from '../../tables/wordlist'
import { listWordsInWordList } from '../../tables/word'
import { isManagedList } from './managed'

interface ListWordListResponse {
	name: string
	icon?: string
	numWords: number
	managed: boolean
}

export const ListWordLists = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const wordListResponses: ListWordListResponse[] = []
		const wordlists = await listWordLists(db)

		for (const wordlist of wordlists) {
			const words = await listWordsInWordList(db, wordlist.name)
			wordListResponses.push({
				name: wordlist.name,
				icon: wordlist.icon,
				numWords: words.length,
				managed: isManagedList(wordlist.name),
			})
		}

		return c.json({ wordLists: wordListResponses })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
