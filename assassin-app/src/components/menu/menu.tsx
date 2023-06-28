import { ReactNode } from 'react'
import './menu.css'

export interface MenuProps {
	children: ReactNode
}

function Menu({ children }: MenuProps) {
	return <div className="menu">{children}</div>
}

export default Menu
