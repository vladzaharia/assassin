import { BasicWordlist, ImportableWordList } from 'assassin-server-client'
import { createWordlistApi } from '../api'

export interface WordListLoaderData {
	wordLists: BasicWordlist[]
	managedLists: ImportableWordList[]
}

export default async function WordlistsLoader() {
	const wordListApi = createWordlistApi()

	return {
		wordLists: (await wordListApi.listWordList()).data.wordLists,
		managedLists: (await wordListApi.checkWordLists()).data,
	} as WordListLoaderData
}
