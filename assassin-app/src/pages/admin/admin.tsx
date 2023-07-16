import Menu from '../../components/menu/menu'
import { hasAuthParams, useAuth } from 'react-oidc-context'
import { faRightFromBracket, faRightToBracket, faTextSize, faUser, faDoorOpen, faDatabase } from '@fortawesome/pro-solid-svg-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import './admin.css'
import Button from '../../components/button/button'
import Status from '../../components/status/status'
import { MenuItem } from '../../components/menu-item/menu-item'
import { useEffect } from 'react'

export default function Admin() {
	const auth = useAuth()
	const location = useLocation()

	useEffect(() => {
		if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
			auth.signinRedirect()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect])

	return (
		<>
			<Menu
				headerProps={{
					title: 'Admin',
					className: 'corner-left',
					rightActions: (
						<>
							{auth.isAuthenticated ? (
								<Status color="green" icon={faUser} popover={{ description: `Signed in as ${auth.user?.profile.name}` }} />
							) : undefined}
							<Button
								color={auth.isAuthenticated ? 'primary' : 'green'}
								onClick={auth.isAuthenticated ? () => void auth.removeUser() : () => void auth.signinRedirect()}
								iconProps={{
									icon: auth.isAuthenticated ? faRightFromBracket : faRightToBracket,
								}}
							/>
						</>
					),
				}}
			>
				{auth.isAuthenticated ? (
					<>
						<MenuItem key="room" color="blue" text="Rooms" icon={faDoorOpen} destination="room" />
						<MenuItem key="wordlist" color="green" text="Word lists" icon={faTextSize} destination="wordlist" />
						<MenuItem key="debug" color="purple" text="Database" icon={faDatabase} destination="database" />
					</>
				) : undefined}
			</Menu>
			<AnimatePresence mode="popLayout">
				<motion.div
					className="admin-content no-animate"
					key={location.pathname}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
				>
					{auth.isAuthenticated ? (
						<Outlet />
					) : (
						<div className="login">{auth.isLoading ? 'Logging in...' : 'Press the login button to continue.'}</div>
					)}
				</motion.div>
			</AnimatePresence>
		</>
	)
}
