import { ReactNode } from 'react'
import './gm-action.css'

interface GMActionProps {
	text: string
	description?: string
	className?: string
	children: ReactNode
}

export default function GMAction({ text, description, className, children }: GMActionProps) {
	return (
		<div className={`action ${className || ''}`}>
			<div className="text">
				<span className="title">{text}</span>
				<span className="description">{description}</span>
			</div>
			{children}
		</div>
	)
}
