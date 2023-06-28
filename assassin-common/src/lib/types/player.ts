export type PlayerStatus = 'alive' | 'eliminated'

interface PlayerCommon {
	name: string
	room: string
	target?: string
	status: PlayerStatus
}

export interface PlayerDbRecord extends PlayerCommon {
	words?: string
}

export interface PlayerResponse extends PlayerCommon {
	words?: string[]
}
