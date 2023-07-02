import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'
import RoomStatus from '../room-status/room-status'
import './menu.css'
import Header from '../header/header'

export interface MenuProps {
	headerProps?: {
		title?: string
		icon?: IconDefinition
		status?: boolean
		onClick?: () => void
	}
	children: ReactNode
}

export default function Menu({ headerProps: header, children }: MenuProps) {
	return (
		<div className="menu">
			{header && (
				<Header
					title={header.title}
					leftActions={
						header.onClick ? (
							<button className="primary" onClick={header.onClick}>
								<FontAwesomeIcon icon={header.icon || faChevronLeft} />
							</button>
						) : undefined
					}
					rightActions={header.status ? <RoomStatus /> : undefined}
				/>
			)}
			{children}
		</div>
	)
}
