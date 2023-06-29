import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHexagonExclamation } from '@fortawesome/pro-regular-svg-icons'

import './error.css'
import { Link, useRouteError } from 'react-router-dom'

export const RouterErrorBoundary = () => {
	const error = useRouteError() as Error

	// Uncaught ReferenceError: path is not defined
	return (
		<div className="error-boundary">
			<h1>Something went wrong!</h1>
			<span>
				Go back to the <Link to="/">start page</Link> to continue.
			</span>
			<span className="details">{error.message}</span>
		</div>
	)
}

export const ErrorField = ({ message, className }: { message: string; className?: string }) => {
	return (
		<div className={`error-field ${className}`}>
			<span>
				<FontAwesomeIcon fontSize={'2rem'} icon={faHexagonExclamation} />
				<span>{message}</span>
			</span>
		</div>
	)
}
