export interface JWTClaims {
	assassin: {
		admin: boolean
		user: boolean
	}
	first_name: string
}

interface GitInfo {
	source: string
	ref: string
	sha: string
}

export interface DeploymentInfo {
	version: {
		app: string
		server: string
	}
	time: number
	git?: GitInfo
}
