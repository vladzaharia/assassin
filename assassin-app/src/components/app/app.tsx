import { ReactNode, useEffect, useRef, useState } from 'react'
import './app.css'
import isMobile from 'is-mobile'
import Button from '../button/button'
import { faCog, faMoon, faRightFromBracket, faRightToBracket, faSun } from '@fortawesome/pro-solid-svg-icons'
import usePrefersColorScheme from 'use-prefers-color-scheme'
import { ContainerContext } from '../../hooks/container'
import { motion } from 'framer-motion'
import { CommonColor, OpenIDScopeProps } from '../../types'
import { useAuth } from 'react-oidc-context'
import { NameContext } from '../../hooks/name'
import useLocalStorage from 'use-local-storage'
import { useLocation, useNavigate } from 'react-router-dom'

export interface AppProps {
	children?: ReactNode
}

export type Theme = 'light' | 'dark'

export default function App({ children }: AppProps) {
	const [theme, setTheme] = useState<Theme>()
	const [color, setColor] = useState<CommonColor>()
	const [nameStorage] = useLocalStorage('name', '')
	const [name, setName] = useState<string | undefined>(nameStorage)
	const defaultTheme = usePrefersColorScheme()
	const auth = useAuth()
	const location = useLocation()
	const navigate = useNavigate()
	const appRef = useRef<HTMLDivElement>(null)

	const isDark = theme === 'dark'

	useEffect(() => {
		setTheme(defaultTheme === 'dark' ? 'dark' : 'light')

		const host = window.location.host
		if (host.includes('staging.')) {
			setColor('blue')
		} else if (host.includes('dev.')) {
			setColor('green')
		} else if (host.includes('localhost')) {
			setColor('purple')
		}

		if (window.location.pathname.includes('/admin')) {
			setColor('admin' as CommonColor)
		}
	}, [window.location.pathname])

	return (
		<NameContext.Provider value={{ name, setName }}>
			<ContainerContext.Provider value={appRef}>
				<div className={`app ${theme} ${color || ''}`} ref={appRef}>
					{!isMobile() ? (
						<motion.div
							className={`no-animate`}
							initial={{ opacity: 0 }}
							whileHover={{
								opacity: 1,
							}}
						>
							<Button
								className="theme"
								color={isDark ? 'orange' : ('purple-dark' as CommonColor)}
								iconProps={{ icon: isDark ? faSun : faMoon, size: 'xl' }}
								onClick={() => setTheme(isDark ? 'light' : 'dark')}
							/>
						</motion.div>
					) : undefined}
					{!isMobile() ? (
						<motion.div
							className={`no-animate`}
							initial={{ opacity: 0 }}
							whileHover={{
								opacity: 1,
							}}
						>
							<Button
								className="login"
								color={auth.isAuthenticated ? 'primary' : 'green'}
								iconProps={{
									icon: auth.isAuthenticated ? faRightFromBracket : faRightToBracket,
									size: 'xl',
								}}
								onClick={auth.isAuthenticated ? () => void auth.removeUser() : () => void auth.signinRedirect()}
							/>
							{(auth.user?.profile.assassin as OpenIDScopeProps)?.admin ? (
								<Button
									className="admin"
									color={'blue'}
									iconProps={{
										icon: faCog,
										size: 'lg',
									}}
									onClick={() => {
										location.pathname.includes('/admin') ? navigate('/') : navigate('/admin')
									}}
								/>
							) : undefined}
						</motion.div>
					) : undefined}
					{children}
				</div>
			</ContainerContext.Provider>
		</NameContext.Provider>
	)
}
