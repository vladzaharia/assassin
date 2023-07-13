import { Params } from 'react-router-dom'
import { createRoomApi } from '../api'

export default async function RoomLoader({ params }: { params: Params }) {
	const roomApi = createRoomApi()
	return (await roomApi.getRoom(params.room || '')).data
}
