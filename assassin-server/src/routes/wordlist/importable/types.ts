import { WordListTable } from '../../../tables/db'

export interface InitialWordList extends WordListTable {
	words: string[]
}

export interface ImportableWordList extends InitialWordList {
	reason?: 'add' | 'update'
}
