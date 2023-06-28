import { PlayerRecord } from "./types";

export function getRoomStatus(records: PlayerRecord[]) {
    return records[0]?.target ? 'started' : records.length > 1 ? 'ready' : 'not-ready'
}