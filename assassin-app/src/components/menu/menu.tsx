import { ReactNode } from 'react'
import './menu.css'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons'

export interface MenuProps {
	header?: {
		title?: string
		icon?: IconDefinition
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
						<button className="secondary" onClick={header.onClick}>
							<FontAwesomeIcon icon={header.icon || faChevronLeft} />
						</button>
					)}
					{header.title && <h2>{header.title}</h2>}
				</div>
			)}
			{children}
		</div>
	)
}

export default Menu
