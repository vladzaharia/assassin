import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'

import Admin from './pages/admin/admin'
import Room from './pages/room/room'
import Welcome from './pages/welcome/welcome'

const oidcConfig: AuthProviderProps = {
	authority: 'https://auth.zhr.one/application/o/word-assassins/',
	client_id: 'qufnWT5HiAmouqtKejlILrTPQvFYj62nGpoyEp1G',
	// redirect_uri: "http://localhost:4200/admin",
	redirect_uri: 'https://assassin.vlad.gg/admin',
	scope: 'openid profile',
}

const router = createBrowserRouter([
	{
		path: '/',
		element: <Welcome />,
	},
	{
		path: '/:room',
		element: <Room />,
	},
	{
		path: '/admin',
		element: (
			<AuthProvider {...oidcConfig}>
				<Admin />
			</AuthProvider>
		),
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
