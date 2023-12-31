import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

export interface Database {
	room: RoomTable
	player: PlayerTable
	word: WordTable
	wordlist: WordListTable
	migration: MigrationTable
}

export type RoomStatus = 'not-ready' | 'started' | 'completed'

export interface RoomTable {
	name: string
	status: RoomStatus
	usesWords: 0 | 1
	numWords: number
	wordlists: string
}

export type PlayerStatus = 'alive' | 'eliminated' | 'champion'

export interface PlayerTable {
	name: string
	room: string
	target?: string
	words?: string
	status: PlayerStatus
	isGM: 0 | 1
}

export interface WordListTable {
	name: string
	description: string
	icon?: string
}

export interface WordTable {
	word: string
	list: string
}

export interface MigrationTable {
	version: number
	name: string
	applied: number
	rolledBack?: number
}

export const getKyselyDb = (database: D1Database) => {
	return new Kysely<Database>({ dialect: new D1Dialect({ database }) })
}
