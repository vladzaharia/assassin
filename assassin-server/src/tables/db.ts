import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

export interface Database {
	room: RoomTable
	player: PlayerTable
	word: WordTable
	wordlist: WordListTable
}

export interface RoomTable {
	name: string
}

export interface PlayerTable {
	name: string
	room: string
	target?: string
	words?: string
	status: 'alive' | 'eliminated'
	isGM: 0 | 1
}

export interface WordListTable {
	name: string
	description: string
}

export interface WordTable {
	word: string
	list: string
}

export const getKyselyDb = (database: D1Database) => {
	return new Kysely<Database>({ dialect: new D1Dialect({ database }) })
}
