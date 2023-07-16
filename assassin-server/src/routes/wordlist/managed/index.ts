import { CARD_DAGGER } from './card-dagger'
import { CARD_POISON } from './card-poison'
import { COUNTRIES } from './countries'
import { POKEMON } from './pokemon'
import { TEAM_GALACTIC } from './team-galactic'
import { TEAM_GREEN } from './team-green'
import { TECHNOLOGY } from './technology'
import { ManagedWordList } from './types'

export const MANAGED_WORDLISTS: ManagedWordList[] = [CARD_DAGGER, CARD_POISON, COUNTRIES, POKEMON, TEAM_GALACTIC, TEAM_GREEN, TECHNOLOGY]

export const isManagedList = (listName: string) => {
	return MANAGED_WORDLISTS.some((wl) => wl.name === listName)
}
