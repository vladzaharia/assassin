import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { createPlayerApi, createRoomApi } from './api'
import ContentBox from './components/content-box/content-box'
import Admin from './pages/admin/admin'
import { RouterErrorBoundary } from './pages/error/error'
import Instructions from './pages/instructions/instructions'
import Mission from './pages/mission/mission'
import RoomSettings from './pages/room-settings/room-settings'
import Room from './pages/room/room'
import Welcome from './pages/welcome/welcome'

/* Global styles */
import App from './components/app/app'
import './styles'

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
		id: 'root',
		errorElement: (
			<ContentBox>
				<RouterErrorBoundary />
			</ContentBox>
		),
		children: [
			{
				path: '/',
				id: 'welcome',
				element: <Welcome />,
			},
			{
				path: 'room/',
				id: 'room-error',
				element: <RouterErrorBoundary />,
			},
			{
				path: '/room/:room',
				id: 'room',
				loader: async ({ params }) => {
					const roomApi = createRoomApi()
					return (await roomApi.getRoom(params.room || '')).data
				},
				element: <Room />,
				children: [
					{
						path: '',
						id: 'instructions',
						element: <Instructions />,
					},
					{
						path: 'settings',
						id: 'room-settings',
						element: <RoomSettings />,
					},
					{
						path: 'mission',
						id: 'mission',
						loader: async ({ params }) => {
							try {
								const name = localStorage.getItem('name')
								if (name) {
									const playerApi = createPlayerApi()
									return (await playerApi.getPlayer(params.room || '', JSON.parse(name))).data
								}
							} catch {
								return {}
							}
						},
						element: <Mission />,
					},
				],
			},
			{
				path: 'admin',
				element: <Admin />,
			},
		],
	},
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<StrictMode>
		<AuthProvider {...oidcConfig}>
			<App>
				<RouterProvider router={router} />
			</App>
		</AuthProvider>
	</StrictMode>
)
