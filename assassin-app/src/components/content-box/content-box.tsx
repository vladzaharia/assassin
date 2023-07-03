import { ReactNode, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { NotificationContext, NotificationDetails } from '../../context/notification'
import Notification from '../notification/notification'
import './content-box.css'

export interface ContentBoxProps {
	children?: ReactNode
}

export default function ContentBox({ children }: ContentBoxProps) {
	const [notification, setError] = useState<NotificationDetails | undefined>(undefined)
	const [showNotification, setShowNotification] = useState<boolean>(false)

	return (
		<NotificationContext.Provider
			value={{
				notification,
				setNotification: (message, source, notificationType, dismissable, timeout) => {
					if (message) {
						setError({ message, source, notificationType, dismissable, timeout })
						setShowNotification(message !== 'ok')
					} else {
						setShowNotification(false)
					}
				},
				setError: (message, source, dismissable, timeout) => {
					if (message) {
						setError({ message, source, notificationType: 'failed', dismissable, timeout })
						setShowNotification(message !== 'ok')
					} else {
						setShowNotification(false)
					}
				},
				showNotification,
				setShowNotification,
			}}
		>
			<div className="content-box">{children ? children : <Outlet />}</div>
			<Notification />
		</NotificationContext.Provider>
	)
}
