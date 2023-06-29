import React from 'react'
import { useAuth } from 'react-oidc-context'

function Admin() {
	const auth = useAuth()

	return auth.isAuthenticated ? (
		<div>
			Hello {auth.user?.profile.name} <button onClick={() => void auth.removeUser()}>Log out</button>
		</div>
	) : auth.isLoading ? (
		<div>Loading...</div>
	) : (
		<button onClick={() => void auth.signinRedirect()}>Log in</button>
	)
}

export default Admin
