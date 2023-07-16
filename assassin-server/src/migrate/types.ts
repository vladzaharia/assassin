export interface Migration {
	version: number
	name: string
	up: (db: D1Database) => void
	down: (db: D1Database) => void
}
