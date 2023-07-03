import { createContext } from 'react'

export type NotificationSource = 'join' | 'leave' | 'gm' | 'room' | 'player'
export type NotificationType = 'success' | 'failed' | 'warning'

export interface NotificationDetails {
	message: string
	notificationType?: NotificationType
	source?: NotificationSource
	dismissable?: boolean
	timeout?: number
}

export interface NotificationContextProps {
	notification?: NotificationDetails
	setNotification: (
		message?: string,
		source?: NotificationSource,
		notificationType?: NotificationType,
		dismissable?: boolean,
		timeout?: number
	) => void
	setError: (message?: string, source?: NotificationSource, dismissable?: boolean, timeout?: number) => void
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
