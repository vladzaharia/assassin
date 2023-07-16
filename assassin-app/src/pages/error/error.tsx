import { Link, useRouteError } from 'react-router-dom'
import './error.css'

export const RouterErrorBoundary = () => {
	const error = useRouteError() as Error

	const linkTo = window.location.pathname.includes("/admin") ? "/admin" : "/"

	// Uncaught ReferenceError: path is not defined
	return (
		<div className="error-boundary">
			<h1>Something went wrong!</h1>
			<span>
				<Link to="." relative="path">
					Try again
				</Link>{' '}
				or go back to the <Link to={linkTo}>start page</Link> to continue.
			</span>
			{error && error.message && (
				<div className="details align-bottom">
					<label htmlFor="error-message">Error details</label> <span id="error-message">{error.message}</span>
				</div>
			)}
		</div>
	)
}
