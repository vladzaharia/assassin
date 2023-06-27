export type Bindings = {
	/* eslint-disable no-undef */
	R2BUCKET: R2Bucket
	D1DATABASE: D1Database
	/* eslint-enable no-undef */
}

export interface AssassinRecord {
	name: string
	room: string
	target?: string
	status: 'alive' | 'eliminated'
}

export interface RoomRecord {
	name: string
	words: string[]
}
