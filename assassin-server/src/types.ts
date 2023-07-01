export type Bindings = {
	/* eslint-disable no-undef */
	R2BUCKET: R2Bucket
	D1DATABASE: D1Database
	OPENID: KVNamespace
	/* eslint-enable no-undef */
}

export interface PlayerRecord {
	name: string
	room: string
	target?: string
	words?: string
	status: 'alive' | 'eliminated'
	isGM: 0 | 1
}

export interface RoomRecord {
	name: string
}

export interface WordListRecord {
	name: string
	description: string
}

export interface WordRecord {
	word: string
	list: string
}
