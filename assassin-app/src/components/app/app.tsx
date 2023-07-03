import { ReactNode, useEffect, useRef, useState } from 'react'
import './app.css'
import isMobile from 'is-mobile'
import Button from '../button/button'
import { faMoon, faSun } from '@fortawesome/pro-solid-svg-icons'
import usePrefersColorScheme from 'use-prefers-color-scheme'
import { ContainerContext } from '../../context/container'
import { motion } from 'framer-motion'

export interface AppProps {
	children?: ReactNode
}

export type Theme = 'light' | 'dark'

export default function App({ children }: AppProps) {
	const [theme, setTheme] = useState<Theme | undefined>()
	const defaultTheme = usePrefersColorScheme()
	const appRef = useRef<HTMLDivElement>(null)

	const isDark = theme === 'dark'

	useEffect(() => {
		setTheme(defaultTheme === 'dark' ? 'dark' : 'light')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<ContainerContext.Provider value={appRef}>
			<div className={`app ${theme}`} ref={appRef}>
				{!isMobile() ? (
					<motion.div
						className={`no-animate`}
						initial={{ opacity: 0 }}
						whileHover={{
							opacity: 1,
						}}
					>
						<Button
							className={`theme ${isDark ? 'orange' : 'purple-dark'}`}
							iconProps={{ icon: isDark ? faSun : faMoon, size: 'xl' }}
							onClick={() => setTheme(isDark ? 'light' : 'dark')}
						/>
					</motion.div>
				) : undefined}
				{children}
			</div>
		</ContainerContext.Provider>
	)
}
