import { AdminApi, Configuration, PlayerApi, RoomApi, WordlistApi } from 'assassin-server-client'

export const getAxiosConfig = () => {
	return new Configuration({
		basePath: import.meta.env.DEV ? 'http://localhost:8787/api' : undefined,
	})
}

export const createRoomApi = () => {
	return new RoomApi(getAxiosConfig())
}

export const createPlayerApi = () => {
	return new PlayerApi(getAxiosConfig())
}

export const createAdminApi = () => {
	return new AdminApi(getAxiosConfig())
}

export const createWordlistApi = () => {
	return new WordlistApi(getAxiosConfig())
}
