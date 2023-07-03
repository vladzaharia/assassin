/* eslint-disable react/jsx-no-useless-fragment */
import { faHexagonExclamation } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { ErrorContext } from '../../context/error'
import './error.css'
import { motion } from 'framer-motion'

export const RouterErrorBoundary = () => {
	const error = useRouteError() as Error

	// Uncaught ReferenceError: path is not defined
	return (
		<div className="error-boundary">
			<h1>Something went wrong!</h1>
			<span>
				<Link to="." relative="path">
					Try again
				</Link>{' '}
				or go back to the <Link to="/">start page</Link> to continue.
			</span>
			{error && error.message && (
				<div className="details align-bottom">
					<label htmlFor="error-message">Error details</label> <span id="error-message">{error.message}</span>
				</div>
			)}
		</div>
	)
}

export const ContextAwareErrorField = ({ className }: { className?: string }) => {
	const context = useContext(ErrorContext)

	return <ErrorField className={className} message={context?.error?.message} show={context?.showError} />
}

export const ErrorField = ({ message, className, show }: { message?: string; className?: string; show?: boolean }) => {
	return (
		<motion.div
			className={`error-field no-animate ${className}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: show ? 1 : 0 }}
			exit={{ opacity: 0 }}
		>
			<span>
				<FontAwesomeIcon fontSize={'2rem'} icon={faHexagonExclamation} />
				<span className="message">{message}</span>
			</span>
		</motion.div>
	)
}
