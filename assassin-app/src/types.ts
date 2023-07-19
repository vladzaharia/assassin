export type CommonColor = 'primary' | 'blue' | 'green' | 'orange' | 'purple' | 'yellow' | 'grey-dark'

export type ApiType = 'gm' | 'admin'

export type Theme = 'light' | 'dark' | undefined

export interface RoomSettingsComponentProps {
	apiType: ApiType
}

export interface OpenIDScopeProps {
	user: boolean
	admin: boolean
}
