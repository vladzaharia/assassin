import { ReactNode } from 'react'
import './header.css'
import { CommonColor } from '../../types'

export interface HeaderProps {
	className?: string
	color?: CommonColor
	title?: string | JSX.Element
	leftActions?: ReactNode
	rightActions?: ReactNode
	bottomBorder?: boolean
}

export default function Header({ color, className, title, leftActions, rightActions, bottomBorder }: HeaderProps) {
	return (
		<div className={`header-wrapper ${color || ''} ${className || ''}`}>
			<div className={`header ${bottomBorder === false ? 'no-border' : ''} ${color} ${className || ''}`}>
				{leftActions && <div className="left-actions">{leftActions}</div>}
				{title && <h3>{title}</h3>}
				{rightActions && <div className="right-actions">{rightActions}</div>}
			</div>
		</div>
	)
}
