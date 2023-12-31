import {
	AdminApi,
	Configuration,
	ConfigurationParameters,
	DatabaseApi,
	GMApi,
	InfoApi,
	PlayerApi,
	RoomApi,
	WordlistApi,
} from 'assassin-server-client'
import { ApiType } from './types'

export const getApiConfig = (parameters: Omit<ConfigurationParameters, 'basePath'> = {}) => {
	return new Configuration({
		...parameters,
		basePath: `${window.location.protocol}//${window.location.host.replace(':4200', ':8787')}/api`,
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

export const createDatabaseApi = (accessToken: string) => {
	return new DatabaseApi(getApiConfig({ accessToken }))
}

export const createInfoApi = () => {
	return new InfoApi(getApiConfig())
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
