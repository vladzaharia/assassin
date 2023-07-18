import { createInfoApi } from '../api'

export default async function AboutLoader() {
	const databaseApi = createInfoApi()
	return (await databaseApi.serverInfo()).data
}
