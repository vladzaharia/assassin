export type Color = 'primary' | 'blue' | 'green' | 'orange' | 'yellow' | 'grey-dark'

export type ApiType = 'gm' | 'admin'

export interface RoomSettingsComponentProps {
	apiType: ApiType
}
