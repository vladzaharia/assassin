import { ReactNode } from 'react'
import './menu.css'

export interface MenuProps {
	header?: ReactNode
	children: ReactNode
}

function Menu({ header, children }: MenuProps) {
	return (
		<div className="menu">
		{header &&
			<div className="header">
			{header}
		</div>}
			{children}
		</div>
	)
}

export default Menu
