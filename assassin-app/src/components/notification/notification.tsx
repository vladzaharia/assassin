import { Snackbar } from '@mui/material'
import './notification.css'
import { faXmark } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquareExclamation, faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons'

export type NotificationType = 'default' | 'success' | 'failed' | 'warning'

export interface NotificationContentProps {
	className?: string
	notificationType: NotificationType
	message: string | JSX.Element
	showClose: boolean
}

export interface NotificationProps extends NotificationContentProps {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Notification({ className, notificationType, message, showClose, open, setOpen }: NotificationProps) {
	const onClose = () => setOpen(false)

	const getIcon = () => {
		switch (notificationType) {
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
			open={open}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			autoHideDuration={5000}
		>
			<div className={`notification ${notificationType} ${className || ''}`}>
				<span>
					{icon && <FontAwesomeIcon className="icon" size="xl" icon={icon} />}
					<span className="message">{message}</span>
					{showClose && <FontAwesomeIcon className="close" icon={faXmark} size="lg" onClick={() => setOpen(false)} />}
				</span>
			</div>
		</Snackbar>
	)
}
