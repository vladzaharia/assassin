import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'

/* Special Elite */
import '@fontsource/special-elite'

/* Barlow */
import '@fontsource/barlow'
import '@fontsource/barlow/200.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'
import '@fontsource/barlow/800.css'

/* Global styles */
import './styles'

import Admin from './pages/admin/admin'
import Room from './pages/room/room'
import Welcome from './pages/welcome/welcome'
import ContentBox from './components/content-box/content-box'
import { RouterErrorBoundary } from './components/error/error'

const oidcConfig: AuthProviderProps = {
	authority: 'https://auth.zhr.one/application/o/word-assassin/',
	client_id: 'qufnWT5HiAmouqtKejlILrTPQvFYj62nGpoyEp1G',
	// redirect_uri: "http://localhost:4200/admin",
	redirect_uri: 'https://assassin.vlad.gg/admin',
	scope: 'openid profile',
}

const router = createBrowserRouter([
	{
		element: <ContentBox />,
		errorElement: (
			<ContentBox>
				<RouterErrorBoundary />
			</ContentBox>
		),
		children: [
			{
				path: '/',
				element: <Welcome />,
			},
			{
				path: 'room/',
				element: <RouterErrorBoundary />,
			},
			{
				path: '/room/:room',
				element: <Room />,
			},
			{
				path: '/admin',
				element: <Admin />,
			},
		],
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<StrictMode>
		<AuthProvider {...oidcConfig}>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
)
