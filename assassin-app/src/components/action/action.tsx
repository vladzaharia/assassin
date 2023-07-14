import { ReactNode } from 'react'
import './action.css'

interface ActionProps {
	text?: string
	description?: string
	className?: string
	children: ReactNode
}

export default function Action({ text, description, className, children }: ActionProps) {
	return (
		<div className={`action ${className || ''}`}>
			<div className="text">
				{text && <span className="title">{text}</span>}
				{description && <span className="description">{description}</span>}
			</div>
			{children}
		</div>
	)
}
