import { ReactNode, useState } from 'react'
import './app.css'

export interface AppProps {
	children?: ReactNode
}

export default function App({ children }: AppProps) {
	const [theme /*, setTheme*/] = useState<string | undefined>()

	return <div className={`app ${theme}`}>{children}</div>
}
