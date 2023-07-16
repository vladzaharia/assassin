import { ReactNode } from 'react'
import './action.css'
import { CommonColor } from '../../types'

interface ActionProps {
	text?: string
	description?: string | JSX.Element
	className?: string
	color?: CommonColor
	children: ReactNode
}

export default function Action({ text, description, className, color, children }: ActionProps) {
	return (
		<div className={`action ${className || ''} ${color || ''}`}>
			<div className="text">
				{text && <span className="title">{text}</span>}
				{description && <span className="description">{description}</span>}
			</div>
			{children}
		</div>
	)
}
