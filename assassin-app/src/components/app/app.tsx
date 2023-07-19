import { ReactNode, useEffect, useRef, useState } from 'react'
import './app.css'
import usePrefersColorScheme from 'use-prefers-color-scheme'
import { ContainerContext } from '../../hooks/container'
import { CommonColor, Theme } from '../../types'
import { NameContext } from '../../hooks/name'
import useLocalStorage from 'use-local-storage'
import GlobalNav from '../global-nav/global-nav'
import { ThemeContext } from '../../hooks/theme'

export interface AppProps {
	children?: ReactNode
}

export default function App({ children }: AppProps) {
	const [theme, setTheme] = useState<Theme>()
	const [color, setColor] = useState<CommonColor>()
	const [nameStorage] = useLocalStorage('name', '')
	const [name, setName] = useState<string | undefined>(nameStorage)
	const defaultTheme = usePrefersColorScheme()
	const appRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setTheme(defaultTheme === 'light' ? 'light' : 'dark')

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
				<ThemeContext.Provider value={{ theme, setTheme }}>
					<div className={`app ${theme} ${color || ''}`} ref={appRef}>
						<GlobalNav />
						{children}
					</div>
				</ThemeContext.Provider>
			</ContainerContext.Provider>
		</NameContext.Provider>
	)
}
