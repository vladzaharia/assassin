import { createDatabaseApi } from '../api'

export default async function DatabaseLoader() {
	const databaseApi = createDatabaseApi('')
	return (await databaseApi.getDatabase()).data
}
