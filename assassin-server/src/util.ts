import { PlayerTable } from "./tables/db";

export function getRoomStatus(records: PlayerTable[]) {
	return records[0]?.target ? 'started' : records.length > 2 ? 'ready' : 'not-ready'
}
