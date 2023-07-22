import { GetManagedWordlists } from '.'

export const isManagedList = (listName: string) => {
	return GetManagedWordlists().some((wl) => wl.name === listName)
}
