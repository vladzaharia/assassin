import Menu from '../../components/menu/menu'
import { hasAuthParams, useAuth } from 'react-oidc-context'
import {
	faRightFromBracket,
	faRightToBracket,
	faTextSize,
	faUser,
	faDoorOpen,
	faDatabase,
	faCircleInfo,
} from '@fortawesome/pro-solid-svg-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './admin.css'
import Button from '../../components/button/button'
import Status from '../../components/status/status'
import { MenuItem } from '../../components/menu-item/menu-item'
import { useEffect } from 'react'
import { OpenIDScopeProps } from '../../types'

export default function Admin() {
	const auth = useAuth()
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
			auth.signinRedirect()
		}
	}, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect])

	useEffect(() => {
		if (auth.user && !(auth.user?.profile.assassin as OpenIDScopeProps)?.admin) {
			console.log(auth.user?.profile.assassin)
			navigate('/')
		}
	}, [auth.user])

	return (
		<>
			<Menu
				headerProps={{
					title: 'Admin',
					className: 'corner-left',
					rightActions: (
						<>
							{auth.isAuthenticated ? (
								<Status
									color="green"
									icon={faUser}
									popover={{
										description: (
											<span>
												Signed in as <span className="fw-500">{auth.user?.profile.name}</span>
											</span>
										),
									}}
								/>
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
						<MenuItem key="about" color="primary" text="About" icon={faCircleInfo} destination="about" />
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
