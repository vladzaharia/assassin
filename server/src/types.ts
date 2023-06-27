export type Bindings = {
	/* eslint-disable no-undef */
	R2BUCKET: R2Bucket
	D1DATABASE: D1Database
	/* eslint-enable no-undef */
}

export interface PlayerRecord {
	name: string
	room: string
	target?: string
	status: 'alive' | 'eliminated'
}

export interface RoomRecord {
	name: string

	/** Words used, as JSON-parseable string */
	words: string
}

export interface WordListRecord {
	name: string
	description: string
}

export interface WordRecord {
	word: string
	list: string
}
