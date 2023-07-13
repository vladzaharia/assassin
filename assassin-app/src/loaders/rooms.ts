import { createRoomApi } from '../api'

export default async function RoomsLoader() {
	const roomApi = createRoomApi()
	return (await roomApi.listRooms()).data.rooms
}
