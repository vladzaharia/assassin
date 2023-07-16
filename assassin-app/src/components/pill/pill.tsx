import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CommonColor } from '../../types'
import { IconDefinition, faXmark } from '@fortawesome/pro-solid-svg-icons'
import './pill.css'
import React from 'react'

export interface PillProps {
	text: string | JSX.Element
	color?: CommonColor
	className?: string
	onClick?: () => void
	onAction?: () => void
	actionIcon?: IconDefinition
}

export default function Pill({ text, color, className, onClick, onAction, actionIcon }: PillProps) {
	return (
		<span className={`pill ${color || ''} ${className || ''} ${onClick ? 'clickable' : ''}`} onClick={onClick}>
			<span>{text}</span>
			{onAction ? (
				<span
					className="delete clickable"
					onClick={(e) => {
						e.stopPropagation()
						onAction()
					}}
				>
					<FontAwesomeIcon icon={actionIcon || faXmark} />
				</span>
			) : undefined}
		</span>
	)
}
