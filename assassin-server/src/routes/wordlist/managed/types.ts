import { WordListTable } from '../../../tables/db'

export interface ManagedWordList extends WordListTable {
	words: string[]
}

export interface ImportableWordList extends ManagedWordList {
	reason?: 'add' | 'update'
}
