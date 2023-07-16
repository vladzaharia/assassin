import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CommonColor } from '../../types'
import { faXmark } from '@fortawesome/pro-solid-svg-icons'
import './pill.css'
import React from 'react'

export interface PillProps {
	text: string | JSX.Element
	color?: CommonColor
	className?: string
	onClick?: () => void
	onDelete?: () => void
}

export default function Pill({ text, color, className, onClick, onDelete }: PillProps) {
	return (
		<span className={`pill ${color || ''} ${className || ''} ${onClick ? 'clickable' : ''}`} onClick={onClick}>
			<span>{text}</span>
			{onDelete ? (
				<span
					className="delete clickable"
					onClick={(e) => {
						e.stopPropagation()
						onDelete()
					}}
				>
					<FontAwesomeIcon icon={faXmark} />
				</span>
			) : undefined}
		</span>
	)
}
