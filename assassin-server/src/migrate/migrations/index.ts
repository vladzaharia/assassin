import { MIGRATION_0_INITIAL } from "./0-initial"
import { Migration } from '../types'

export function getAllMigrations(): Migration[] {
	return [MIGRATION_0_INITIAL]
}
