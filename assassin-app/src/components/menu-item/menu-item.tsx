import { IconDefinition } from '@fortawesome/pro-regular-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import Button, { ButtonProps } from '../button/button'
import './menu-item.css'
import { CommonColor } from '../../types'

interface MenuItemProps extends ButtonProps {
	icon: IconDefinition
	destination: string
	color: CommonColor
}

export function MenuItem({ color, text, icon, className, destination, ...buttonProps }: MenuItemProps) {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<div
			className={`menu-item clickable ${color} ${className || ''}`}
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
				color={color}
				iconProps={{
					icon: icon,
				}}
				{...buttonProps}
			/>
			<span className="fw-500">{text}</span>
		</div>
	)
}
