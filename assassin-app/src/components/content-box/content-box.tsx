import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NotificationContext, NotificationDetails } from '../../context/notification'
import './content-box.css'
import Notification from '../notification/notification'

export interface ContentBoxProps {
	children?: ReactNode
}

export default function ContentBox({ children }: ContentBoxProps) {
	const location = useLocation()
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
			<AnimatePresence mode="popLayout">
				<motion.div
					className="content-box no-animate"
					key={location.pathname}
					initial={{ opacity: 0.5 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0.75 }}
					transition={{ duration: 0.5 }}
				>
					{children ? children : <Outlet />}
				</motion.div>
			</AnimatePresence>
			<Notification />
		</NotificationContext.Provider>
	)
}
