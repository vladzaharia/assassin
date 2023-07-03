/* eslint-disable react/jsx-no-useless-fragment */
import { faHexagonExclamation } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { ErrorContext } from '../../context/error'
import './error.css'
import { AnimatePresence, motion } from 'framer-motion'

export const RouterErrorBoundary = () => {
	const error = useRouteError() as Error

	// Uncaught ReferenceError: path is not defined
	return (
		<div className="error-boundary">
			<h1>Something went wrong!</h1>
			<span>
				Go back to the <Link to="/">start page</Link> to continue.
			</span>
			{error && error.message && <span className="details">{error.message}</span>}
		</div>
	)
}

export const ContextAwareErrorField = ({ className }: { className?: string }) => {
	const context = useContext(ErrorContext)

	return (
		<AnimatePresence>
				<ErrorField className={className} message={context?.error?.message} show={context?.showError} />
			</AnimatePresence>
	)
}

export const ErrorField = ({ message, className, show }: { message?: string; className?: string, show?: boolean }) => {
	return (
		<motion.div className={`error-field no-animate ${className}`} initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} exit={{ opacity: 0 }}>
			<span>
				<FontAwesomeIcon fontSize={'2rem'} icon={faHexagonExclamation} />
				<span className="message">{message}</span>
			</span>
		</motion.div>
	)
}
