import React, { Component, ErrorInfo, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHexagonExclamation } from '@fortawesome/pro-regular-svg-icons'

import './error.css'

interface Props {
	children?: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	}

	public static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error }
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo)
	}

	public render() {
		if (this.state.hasError) {
			return <h1>{this.state.error?.message}</h1>
		}

		return this.props.children
	}
}

export default ErrorBoundary

export const ErrorField = ({ message, className }: { message: string, className?: string }) => {
	return (
		<div className={`error-field ${className}`}>
			<span>
				<FontAwesomeIcon fontSize={'2rem'} icon={faHexagonExclamation} />
				<span>{message}</span>
			</span>
		</div>
	)
}
