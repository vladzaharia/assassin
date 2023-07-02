import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'
import RoomStatus from '../room-status/room-status'
import './menu.css'

export interface MenuProps {
	header?: {
		title?: string
		icon?: IconDefinition
		status?: boolean
		onClick?: () => void
	}
	children: ReactNode
}

function Menu({ header, children }: MenuProps) {
	return (
		<div className="menu">
			{header && (
				<div className="header">
					{header.onClick && (
						<button className="primary" onClick={header.onClick}>
							<FontAwesomeIcon icon={header.icon || faChevronLeft} />
						</button>
					)}
					{header.title && <h3>{header.title}</h3>}
					{header.status ? <RoomStatus /> : undefined}
				</div>
			)}
			{children}
		</div>
	)
}

export default Menu
