import { createWordlistApi } from '../api'

export default async function WordlistsLoader() {
	const wordListApi = createWordlistApi()
	return (await wordListApi.listWordList()).data.wordLists
}
