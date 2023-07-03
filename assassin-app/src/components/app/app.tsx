import { ReactNode, useEffect, useState } from 'react'
import './app.css'
import isMobile from 'is-mobile'
import Button from '../button/button'
import { faMoon, faSun } from '@fortawesome/pro-solid-svg-icons'
import usePrefersColorScheme from 'use-prefers-color-scheme'

export interface AppProps {
	children?: ReactNode
}

export type Theme = "light" | "dark"

export default function App({ children }: AppProps) {
	const [theme, setTheme] = useState<Theme | undefined>()
	const defaultTheme = usePrefersColorScheme()

	useEffect(() => {
		setTheme(defaultTheme === 'dark' ? 'dark' : 'light')
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <div className={`app ${theme}`}>
		{!isMobile() ? <Button className={`theme ${theme === "dark" ? 'orange' : 'purple-dark'}`} iconProps={{ icon: theme === "dark" ? faSun : faMoon, size: 'xl' }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />: undefined}
		{children}
	</div>
}
