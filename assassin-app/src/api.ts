import { AdminApi, Configuration, GMApi, PlayerApi, RoomApi, WordlistApi } from 'assassin-server-client'

const getApiConfig = () => {
	return new Configuration({
		basePath: import.meta.env.DEV ? 'http://localhost:8787/api' : undefined,
	})
}

export const createAdminApi = () => {
	return new AdminApi(getApiConfig())
}

export const createRoomApi = () => {
	return new RoomApi(getApiConfig())
}

export const createPlayerApi = () => {
	return new PlayerApi(getApiConfig())
}

export const createGMApi = () => {
	return new GMApi(getApiConfig())
}

export const createWordlistApi = () => {
	return new WordlistApi(getApiConfig())
}
