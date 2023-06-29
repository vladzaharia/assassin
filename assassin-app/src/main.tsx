import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'

import Admin from './pages/admin/admin'
import Room from './pages/room/room'
import Welcome from './pages/welcome/welcome'
import ContentBox from './components/content-box/content-box'
import { RouterErrorBoundary } from './components/error/error'

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
		errorElement: <RouterErrorBoundary />,
	},
	{
		path: '/room/',
		element: <Welcome />,
		errorElement: <RouterErrorBoundary />,
	},
	{
		path: '/room/:room',
		element: <Room />,
		errorElement: <RouterErrorBoundary />,
	},
	{
		path: '/admin',
		element: (
			<AuthProvider {...oidcConfig}>
				<Admin />
			</AuthProvider>
		),
		errorElement: <RouterErrorBoundary />,
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<StrictMode>
		<ContentBox>
			<RouterProvider router={router} />
		</ContentBox>
	</StrictMode>
)
