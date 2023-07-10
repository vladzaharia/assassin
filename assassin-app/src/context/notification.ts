import { IconDefinition } from '@fortawesome/pro-regular-svg-icons'
import { createContext } from 'react'

export type NotificationSource = 'join' | 'leave' | 'gm-start' | 'gm-reset' | 'room' | 'player' | 'wordlist'
export type NotificationType = 'success' | 'failed' | 'warning'

export interface NotificationDetails {
	message: string
	icon?: IconDefinition
	notificationType?: NotificationType
	source?: NotificationSource
	dismissable?: boolean
	timeout?: number
}

export interface NotificationContextProps {
	notification?: NotificationDetails
	setNotification: React.Dispatch<React.SetStateAction<NotificationDetails | undefined>>
	setError: (message?: string, source?: NotificationSource) => void
	showNotification: boolean
	setShowNotification: React.Dispatch<React.SetStateAction<boolean>>
}
export const NotificationContext = createContext<NotificationContextProps>({
	setNotification: () => {
		return
	},
	setError: () => {
		return
	},
	showNotification: false,
	setShowNotification: () => {
		return
	},
})
