import { Context } from 'hono'
import { Bindings } from '../../../bindings'
import { listWordsInWordList } from '../../../tables/word'
import { listWordLists } from '../../../tables/wordlist'
import { GetManagedWordlists } from '../managed'
import { ImportableWordList } from '../managed/types'

export const ListManagedWordLists = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const wordLists = await listWordLists(db)
		const wordListsToAdd: ImportableWordList[] = GetManagedWordlists().filter((wl) => !wordLists.some((record) => record.name === wl.name))
		const wordListsToUpdate: ImportableWordList[] = []

		for (const wordList of wordLists) {
			const words = await listWordsInWordList(db, wordList.name)
			const managedList = GetManagedWordlists().filter((wl) => wl.name === wordList.name)[0]

			if (
				managedList &&
				(managedList.words.length !== words.length ||
					managedList.description !== wordList.description ||
					managedList.icon !== wordList.icon)
			) {
				wordListsToUpdate.push({
					...managedList,
					reason: 'update',
				})
			}
		}

		return c.json(
			[...wordListsToAdd, ...wordListsToUpdate].map((wl) => {
				return {
					name: wl.name,
					icon: wl.icon,
					reason: wl.reason || 'add',
				}
			}),
			200
		)
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
