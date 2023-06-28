import React from 'react'
import { useAuth } from 'react-oidc-context'
import ContentBox from '../../components/content-box/content-box'

function Admin() {
	const auth = useAuth()

	return (
		<ContentBox>
			{auth.isAuthenticated ? (
				<div>
					Hello {auth.user?.profile.name} <button onClick={() => void auth.removeUser()}>Log out</button>
				</div>
			) : auth.isLoading ? (
				<div>Loading...</div>
			) : (
				<button onClick={() => void auth.signinRedirect()}>Log in</button>
			)}
		</ContentBox>
	)
}

export default Admin
