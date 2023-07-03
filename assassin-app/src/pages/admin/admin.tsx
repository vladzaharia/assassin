import Button from '../../components/button/button'
import { useAuth } from 'react-oidc-context'

export default function Admin() {
	const auth = useAuth()

	return auth.isAuthenticated ? (
		<div>
			Hello {auth.user?.profile.name} <button onClick={() => void auth.removeUser()}>Log out</button>
		</div>
	) : auth.isLoading ? (
		<div>Loading...</div>
	) : (
		<Button text="Log in" onClick={() => void auth.signinRedirect()} />
	)
}
