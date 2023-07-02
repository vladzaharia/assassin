import { ReactNode } from 'react'
import './header.css'

export interface HeaderProps {
	title?: string
	leftActions?: ReactNode
	rightActions?: ReactNode
	bottomBorder?: boolean
}

export default function Header({ title, leftActions, rightActions, bottomBorder }: HeaderProps) {
	return (
		<div className={`header ${bottomBorder === false ? 'no-border' : ''}`}>
			{leftActions && <div className="left-actions">{leftActions}</div>}
			{title && <h3>{title}</h3>}
			{rightActions && <div className="right-actions">{rightActions}</div>}
		</div>
	)
}
