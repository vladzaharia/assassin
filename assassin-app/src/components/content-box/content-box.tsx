import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import './content-box.css'

export interface ContentBoxProps {
	children?: ReactNode
}

export default function ContentBox({ children }: ContentBoxProps) {
	const location = useLocation()

	return (
		<div className="app">
			<AnimatePresence mode="popLayout">
				<motion.div
					className="content-box no-animate"
					key={location.pathname}
					initial={{ opacity: 0.5 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0.75 }}
					transition={{ duration: 0.5 }}
				>
					{children ? children : <Outlet />}
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
