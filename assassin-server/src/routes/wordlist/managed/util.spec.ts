import { vi } from 'vitest'
import { ManagedWordList } from './types'
import { isManagedList } from './util'

const MANAGED_WORD_LISTS = vi.hoisted(() => {
	return [
		{
			name: 'test-list',
			description: 'Some test managed list.',
			words: ['some', 'words', 'go', 'here'],
			icon: 'flask',
		},
	] as ManagedWordList[]
})

vi.mock('.', () => {
	return {
		GetManagedWordlists: vi.fn().mockImplementation(() => MANAGED_WORD_LISTS),
	}
})

describe('isManagedList', () => {
	test('in list', () => {
		expect(isManagedList('test-list')).toBeTruthy()
	})

	test('not in list', () => {
		expect(isManagedList('test-list-2')).toBeFalsy()
	})
})
