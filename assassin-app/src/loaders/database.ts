import { createInfoApi } from '../api'

export default async function DatabaseLoader() {
	const databaseApi = createInfoApi()
	return (await databaseApi.getDatabase()).data
}
