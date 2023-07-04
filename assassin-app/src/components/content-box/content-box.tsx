import { ReactNode, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { NotificationContext, NotificationDetails } from '../../context/notification'
import Notification from '../notification/notification'
import './content-box.css'

export interface ContentBoxProps {
	children?: ReactNode
}

export default function ContentBox({ children }: ContentBoxProps) {
	const [notification, setNotification] = useState<NotificationDetails | undefined>(undefined)
	const [showNotification, setShowNotification] = useState<boolean>(false)

	return (
		<NotificationContext.Provider
			value={{
				notification,
				setNotification: (notification) => {
					setNotification(notification)
					setShowNotification(true)
				},
				setError: (message, source) => {
					if (message) {
						setNotification({ message, source, notificationType: 'failed' })
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
