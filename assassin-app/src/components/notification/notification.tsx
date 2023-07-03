import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Snackbar } from '@mui/material'
import './notification.css'
import { faXmark } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type NotificationColor = 'primary' | 'blue' | 'green' | 'orange' | 'grey-dark' | 'failed'

export interface NotificationContentProps {
	className?: string
	color: NotificationColor
	icon?: IconDefinition
	message: string
	showClose: boolean
}

export interface NotificationProps extends NotificationContentProps {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Notification({ className, color, icon, message, showClose, open, setOpen }: NotificationProps) {
	const onClose = () => setOpen(false)

	return (
		<Snackbar
			open={open}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			// autoHideDuration={6000}
		>
			<div className={`notification ${color} ${className || ''}`}>
				<span>
					{icon && <FontAwesomeIcon size="xl" icon={icon} />}
					<span className="message">{message}</span>
					{showClose && <FontAwesomeIcon className="close" icon={faXmark} size="lg" onClick={() => setOpen(false)} />}
				</span>
			</div>
		</Snackbar>
	)
}
