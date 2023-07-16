import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { deleteWordsInWordList, insertWords, listWordsInWordList } from '../../tables/word'
import { deleteWordList, insertWordList, listWordLists } from '../../tables/wordlist'
import { MANAGED_WORDLISTS } from './managed'
import { ImportableWordList } from './managed/types'

export const GetUninitializedWordLists = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const wordLists = await listWordLists(db)
		const wordListsToAdd: ImportableWordList[] = MANAGED_WORDLISTS.filter((wl) => !wordLists.some((record) => record.name === wl.name))
		const wordListsToUpdate: ImportableWordList[] = []

		for (const wordList of wordLists) {
			const words = await listWordsInWordList(db, wordList.name)
			const managedList = MANAGED_WORDLISTS.filter((wl) => wl.name === wordList.name)[0]

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

export const InitializeWordlists = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const { importList: list } = c.req.param()

		const initialWordList = MANAGED_WORDLISTS.filter((wl) => wl.name === list)[0]

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

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
