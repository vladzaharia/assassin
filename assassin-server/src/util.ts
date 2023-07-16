import { PlayerTable, RoomStatus } from './tables/db'

export function getRoomStatus(status: RoomStatus, records: PlayerTable[]) {
	if (status === 'not-ready' && records.length > 2) {
		return 'ready'
	}

	return status
}
