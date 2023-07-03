import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons'
import { ReactNode } from 'react'
import RoomStatus from '../room-status/room-status'
import './menu.css'
import Header from '../header/header'
import Button from '../button/button'

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
					className="center"
					leftActions={
						header.onClick ? (
							<Button
								className="primary"
								onClick={header.onClick}
								iconProps={{
									icon: header.icon || faChevronLeft,
								}}
							/>
						) : undefined
					}
					rightActions={header.status ? <RoomStatus showPopover /> : undefined}
				/>
			)}
			{children}
		</div>
	)
}
