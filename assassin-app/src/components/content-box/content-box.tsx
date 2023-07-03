import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ErrorContext, RequestError } from '../../context/error'
import { ContextAwareErrorField } from '../error/error'
import './content-box.css'

export interface ContentBoxProps {
	children?: ReactNode
}

export default function ContentBox({ children }: ContentBoxProps) {
	const location = useLocation()
	const [requestError, setRequestError] = useState<RequestError | undefined>(undefined)
	const [showError, setShowError] = useState<boolean>(false)

	useEffect(() => {
		const interval = setInterval(() => setShowError(false), 5 * 1000)
		return () => clearInterval(interval)
	}, [requestError])

	return (
		<ErrorContext.Provider
			value={{
				error: requestError,
				setError: (message, errorType) => {
					if (message) {
						setRequestError({ message, errorType })
						setShowError(message !== 'ok')
					} else {
						setShowError(false)
					}
				},
				showError,
				setShowError
			}}
		>
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
				<ContextAwareErrorField className="align-bottom" />
			</div>
		</ErrorContext.Provider>
	)
}
