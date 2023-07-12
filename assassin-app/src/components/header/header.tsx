import { ReactNode } from 'react'
import './header.css'

export interface HeaderProps {
	className?: string
	title?: string
	leftActions?: ReactNode
	rightActions?: ReactNode
	bottomBorder?: boolean
}

export default function Header({ className, title, leftActions, rightActions, bottomBorder }: HeaderProps) {
	return (
		<div className={`header-wrapper ${className || ''}`}>
			<div className={`header ${bottomBorder === false ? 'no-border' : ''} ${className || ''}`}>
				{leftActions && <div className="left-actions">{leftActions}</div>}
				{title && <h3>{title}</h3>}
				{rightActions && <div className="right-actions">{rightActions}</div>}
			</div>
		</div>
	)
}
