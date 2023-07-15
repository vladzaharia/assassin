import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import './button.css'
import Popover, { PopoverProps } from '../popover/popover'
import React, { useContext, useRef, useState } from 'react'
import isMobile from 'is-mobile'
import { NotificationSource } from '../../hooks/notification'
import { NotificationContext } from '../../hooks/notification'

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	className?: string
	text?: string
	iconProps?: FontAwesomeIconProps
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	popoverProps?: Omit<PopoverProps, 'anchor' | 'open' | 'onClose'>
}

export default function Button({ className, disabled, text, iconProps, onClick, popoverProps, ...buttonProps }: ButtonProps) {
	const popoverAnchor = useRef<HTMLButtonElement>(null)
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

	return (
		<button
			{...buttonProps}
			ref={popoverAnchor}
			className={`button ${className || ''}`}
			disabled={disabled}
			onClick={
				onClick ||
				(() => {
					return
				})
			}
			onPointerEnter={() => {
				if (!isMobile()) {
					setPopoverOpen(true)
				}
			}}
			onPointerLeave={() => {
				if (!isMobile()) {
					setPopoverOpen(false)
				}
			}}
		>
			{iconProps && <FontAwesomeIcon {...iconProps} />}
			{text && <span>{text}</span>}
			{popoverProps ? (
				<Popover {...popoverProps} open={popoverOpen} onClose={() => setPopoverOpen(false)} anchor={popoverAnchor.current} />
			) : undefined}
		</button>
	)
}

export interface NotificationAwareButtonProps extends ButtonProps {
	notificationSources: NotificationSource[]
}

export function NotificationAwareButton({ className, notificationSources, ...buttonProps }: NotificationAwareButtonProps) {
	const { notification, showNotification } = useContext(NotificationContext)
	return (
		<Button
			className={
				showNotification && notificationSources.includes(notification?.source as NotificationSource)
					? notification?.notificationType || 'primary'
					: className
			}
			{...buttonProps}
		/>
	)
}
