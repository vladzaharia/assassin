import { createMigrationTable, dropMigrationTable } from "../../tables/migration";
import { createPlayerTable, dropPlayerTable } from "../../tables/player";
import { createRoomsTable, dropRoomTable } from "../../tables/room";
import { createWordTable, dropWordTable } from "../../tables/word";
import { createWordListTable, dropWordListTable } from "../../tables/wordlist";
import { Migration } from "../types";

export const MIGRATION_0_INITIAL: Migration = {
	version: 0,
	name: "initial-migration",
	up: async (db: D1Database) => {
		await createRoomsTable(db)
		await createPlayerTable(db)
		await createWordListTable(db)
		await createWordTable(db)
		await createMigrationTable(db)
	},
	down: async (db: D1Database) => {
		await dropPlayerTable(db)
		await dropRoomTable(db)
		await dropWordTable(db)
		await dropWordListTable(db)
		await dropMigrationTable(db)
	}
}
