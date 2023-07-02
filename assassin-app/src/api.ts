import { AdminApi, Configuration, ConfigurationParameters, GMApi, PlayerApi, RoomApi, WordlistApi } from 'assassin-server-client'

const getApiConfig = (parameters: Omit<ConfigurationParameters, 'basePath'> = {}) => {
	return new Configuration({
		...parameters,
		basePath: import.meta.env.DEV ? 'http://localhost:8787/api' : undefined,
	})
}

export const createAdminApi = (accessToken: string) => {
	return new AdminApi(getApiConfig({ accessToken }))
}

export const createRoomApi = () => {
	return new RoomApi(getApiConfig())
}

export const createPlayerApi = () => {
	return new PlayerApi(getApiConfig())
}

export const createGMApi = (apiKey: string) => {
	return new GMApi(getApiConfig({ apiKey }))
}

export const createWordlistApi = () => {
	return new WordlistApi(getApiConfig())
}
