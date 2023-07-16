import { BasicWordlist, ImportableWordList } from 'assassin-server-client'
import { createWordlistApi } from '../api'

export interface WordListLoaderData {
	wordLists: BasicWordlist[]
	importableLists: ImportableWordList[]
}

export default async function WordlistsLoader() {
	const wordListApi = createWordlistApi()

	return {
		wordLists: (await wordListApi.listWordList()).data.wordLists,
		importableLists: (await wordListApi.checkWordLists()).data,
	} as WordListLoaderData
}
