import { RoomStatus } from './tables/db'
import { PlayerRecord } from './types'

export function getRoomStatus(status: RoomStatus, records: PlayerRecord[]) {
	if (status === 'not-ready' && records.length > 2) {
		return 'ready'
	}

	return status
}
