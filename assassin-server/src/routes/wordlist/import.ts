import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createWordTable, deleteWordsInWordList, insertWords, listWordsInWordList } from '../../tables/word'
import { createWordListTable, deleteWordList, insertWordList, listWordLists } from '../../tables/wordlist'
import { AVAILABLE_WORDLISTS } from './importable'
import { ImportableWordList } from './importable/types'

export const GetUninitializedWordLists = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		// Create D1 tables if needed
		await createWordListTable(db)
		await createWordTable(db)

		const wordLists = await listWordLists(db)
		const wordListsToAdd: ImportableWordList[] = AVAILABLE_WORDLISTS.filter((wl) => !wordLists.some((record) => record.name === wl.name))
		const wordListsToUpdate: ImportableWordList[] = []

		for (const wordList of wordLists) {
			const words = await listWordsInWordList(db, wordList.name)
			const managedList = AVAILABLE_WORDLISTS.filter((wl) => wl.name === wordList.name)[0]

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

		// Create D1 tables if needed
		await createWordListTable(db)
		await createWordTable(db)

		const initialWordList = AVAILABLE_WORDLISTS.filter((wl) => wl.name === list)[0]

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
