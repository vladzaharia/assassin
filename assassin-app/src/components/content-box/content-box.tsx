import { ReactNode } from 'react'
import './content-box.css'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export interface ContentBoxProps {
	children?: ReactNode
}

function ContentBox({ children }: ContentBoxProps) {
	const location = useLocation()

	return (
		<div className="app">
			<AnimatePresence mode="popLayout">
				<motion.div
					className="content-box"
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

export default ContentBox
