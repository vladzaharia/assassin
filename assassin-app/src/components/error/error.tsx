import { faHexagonExclamation } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createContext, useContext } from 'react'
import { Link, useRouteError } from 'react-router-dom'
import './error.css'

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

export interface ErrorFieldContextProps {
	message?: string
	setMessage: React.Dispatch<React.SetStateAction<string | undefined>>
}
export const ErrorFieldContext = createContext<ErrorFieldContextProps | undefined>(undefined)

export const ContextAwareErrorField = ({ className }: { className?: string }) => {
	const context = useContext(ErrorFieldContext)

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return context && context.message && context.message !== 'ok' ? <ErrorField className={className} message={context.message} /> : <></>
}

export const ErrorField = ({ message, className }: { message: string; className?: string }) => {
	return (
		<div className={`error-field ${className}`}>
			<span>
				<FontAwesomeIcon fontSize={'2rem'} icon={faHexagonExclamation} />
				<span className="message">{message}</span>
			</span>
		</div>
	)
}
