import { CARD_DAGGER } from './lists/card-dagger'
import { CARD_POISON } from './lists/card-poison'
import { COUNTRIES } from './lists/countries'
import { POKEMON } from './lists/pokemon'
import { TEAM_GALACTIC } from './lists/team-galactic'
import { TEAM_GREEN } from './lists/team-green'
import { TECHNOLOGY } from './lists/technology'

export const GetManagedWordlists = () => {
	return [CARD_DAGGER, CARD_POISON, COUNTRIES, POKEMON, TEAM_GALACTIC, TEAM_GREEN, TECHNOLOGY]
}
