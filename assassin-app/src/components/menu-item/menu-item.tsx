import { IconDefinition } from '@fortawesome/pro-regular-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import Button, { ButtonProps } from '../button/button'
import './menu-item.css'

interface MenuItemProps extends ButtonProps {
	icon: IconDefinition
	destination: string
}

export function MenuItem({ text, icon, className, destination, ...buttonProps }: MenuItemProps) {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<div
			className={`menu-item clickable ${className || ''}`}
			onClick={() => {
				if (!location.pathname.includes(destination)) {
					navigate(destination)
				} else {
					navigate('..', { relative: 'path' })
				}
			}}
		>
			<Button
				className={className}
				iconProps={{
					icon: icon,
				}}
				{...buttonProps}
			/>
			<span className="text">{text}</span>
		</div>
	)
}
