import { Params } from 'react-router-dom'
import { createWordlistApi } from '../api'

export default async function WordlistLoader({ params }: { params: Params }) {
	const wordListApi = createWordlistApi()
	return (await wordListApi.getWordList(params.list || '')).data
}
