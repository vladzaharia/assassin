import { ReactNode } from 'react'
import './menu.css'
import Header, { HeaderProps } from '../header/header'
import { AnimatePresence } from 'framer-motion'

export interface MenuProps {
	headerProps?: HeaderProps
	children: ReactNode
}

export default function Menu({ headerProps, children }: MenuProps) {
	return (
		<div className="menu">
			<AnimatePresence mode="popLayout" key="menu-animate">
				{headerProps && <Header className="center corner-left" key="header" {...headerProps} />}
				{children}
			</AnimatePresence>
		</div>
	)
}
