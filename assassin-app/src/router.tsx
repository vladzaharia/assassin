import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { AuthProvider, AuthProviderProps } from 'react-oidc-context'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './components/app/app'
import ContentBox from './components/content-box/content-box'
import DatabaseLoader from './loaders/database'
import PlayerLoader from './loaders/player'
import RoomLoader from './loaders/room'
import RoomsLoader from './loaders/rooms'
import WordlistLoader from './loaders/wordlist'
import WordlistsLoader from './loaders/wordlists'
import Admin from './pages/admin/admin'
import AdminDatabase from './pages/admin/database/database'
import AdminHome from './pages/admin/home/home'
import RoomsAdmin from './pages/admin/room-list/room-list'
import RoomAdmin from './pages/admin/room/room'
import WordlistsAdmin from './pages/admin/wordlist-list/wordlist-list'
import WordlistAdmin from './pages/admin/wordlist/wordlist'
import { RouterErrorBoundary } from './pages/error/error'
import Complete from './pages/room/complete/complete'
import Instructions from './pages/room/instructions/instructions'
import Mission from './pages/room/mission/mission'
import Room from './pages/room/room'
import RoomSettings from './pages/room/settings/room-settings'
import Welcome from './pages/welcome/welcome'
import './styles'
import AboutLoader from './loaders/about'
import AdminAbout from './pages/admin/about/about'

const oidcConfig: AuthProviderProps = {
	authority: 'https://auth.zhr.one/application/o/word-assassin/',
	client_id: 'qufnWT5HiAmouqtKejlILrTPQvFYj62nGpoyEp1G',
	redirect_uri: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
	scope: 'openid profile assassin',
	onSigninCallback: () => {
		window.history.replaceState({}, document.title, window.location.pathname)
	},
}

const router = createBrowserRouter([
	{
		element: (
			<App>
				<ContentBox />
			</App>
		),
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
				path: 'room/:room',
				id: 'room',
				loader: RoomLoader,
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
						loader: PlayerLoader,
						element: <Mission />,
					},
					{
						path: 'complete',
						id: 'complete',
						element: <Complete />,
					},
				],
			},
			{
				path: 'admin',
				element: <Admin />,
				children: [
					{
						path: '',
						id: 'admin-home',
						element: <AdminHome />,
					},
					{
						path: 'room',
						id: 'admin-room-list',
						loader: RoomsLoader,
						element: <RoomsAdmin />,
					},
					{
						path: 'room/:room',
						id: 'admin-room',
						loader: RoomLoader,
						element: <RoomAdmin />,
					},
					{
						path: 'wordlist',
						id: 'admin-wordlist-list',
						loader: WordlistsLoader,
						element: <WordlistsAdmin />,
					},
					{
						path: 'wordlist/:list',
						id: 'admin-wordlist',
						loader: WordlistLoader,
						element: <WordlistAdmin />,
					},
					{
						path: 'database',
						id: 'admin-database',
						loader: DatabaseLoader,
						element: <AdminDatabase />,
					},
					{
						path: 'about',
						id: 'admin-about',
						loader: AboutLoader,
						element: <AdminAbout />,
					},
				],
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
