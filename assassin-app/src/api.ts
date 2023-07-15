import { AdminApi, Configuration, ConfigurationParameters, GMApi, PlayerApi, RoomApi, WordlistApi } from 'assassin-server-client'
import { ApiType } from './types'

const getApiConfig = (parameters: Omit<ConfigurationParameters, 'basePath'> = {}) => {
	return new Configuration({
		...parameters,
		basePath: import.meta.env.DEV ? 'http://localhost:8787/api' : undefined,
	})
}

export const createAdminOrGMApi = (apiType: ApiType, apiKey: string, accessToken: string) => {
	let api: GMApi | AdminApi

	if (apiType === 'admin') {
		api = createAdminApi(accessToken)
	} else {
		api = createGMApi(apiKey)
	}

	return api
}

export const createAdminApi = (accessToken: string) => {
	return new AdminApi(getApiConfig({ accessToken }))
}

export const createRoomApi = () => {
	return new RoomApi(getApiConfig())
}

export const createPlayerApi = (apiKey: string) => {
	return new PlayerApi(getApiConfig({ apiKey }))
}

export const createGMApi = (apiKey: string) => {
	return new GMApi(getApiConfig({ apiKey }))
}

export const createWordlistApi = () => {
	return new WordlistApi(getApiConfig())
}
