import { Snackbar } from '@mui/material'
import './notification.css'
import { faXmark } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquareExclamation, faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons'
import { NotificationContext } from '../../context/notification'
import { useContext } from 'react'

export default function Notification() {
	const { notification, showNotification, setShowNotification } = useContext(NotificationContext)

	const onClose = () => setShowNotification(false)

	const getIcon = () => {
		switch (notification?.notificationType) {
			case 'success':
				return faSquareCheck
			case 'failed':
				return faSquareExclamation
			case 'warning':
				return faTriangleExclamation
		}
	}

	const icon = getIcon()

	return (
		<Snackbar
			open={showNotification}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			autoHideDuration={notification?.timeout || 5000}
		>
			<div className={`no-animate notification ${notification?.notificationType || ''}`}>
				<span>
					{icon && <FontAwesomeIcon className="icon" size="xl" icon={icon} />}
					<span className="message">{notification?.message}</span>
					{notification?.dismissable && <FontAwesomeIcon className="close" icon={faXmark} size="lg" onClick={() => (false)} />}
				</span>
			</div>
		</Snackbar>
	)
}
