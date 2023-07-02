import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ErrorContext, RequestError } from '../../context/error'
import './content-box.css'
import { ContextAwareErrorField } from '../error/error'

export interface ContentBoxProps {
	children?: ReactNode
}

export default function ContentBox({ children }: ContentBoxProps) {
	const location = useLocation()
	const [requestError, setRequestError] = useState<RequestError | undefined>(undefined)

	useEffect(() => {
		const interval = setInterval(() => setRequestError(undefined), 5 * 1000)
		return () => clearInterval(interval)
	}, [requestError])


	return (
		<ErrorContext.Provider
			value={{
				error: requestError,
				setError: (message, errorType) => setRequestError(message ? { message, errorType } : undefined),
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
				{requestError && requestError.message !== 'ok' ? <ContextAwareErrorField className="align-bottom" />: undefined}
			</div>
		</ErrorContext.Provider>
	)
}
