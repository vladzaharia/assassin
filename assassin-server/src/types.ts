export type Bindings = {
	/* eslint-disable no-undef */
	R2BUCKET: R2Bucket
	D1DATABASE: D1Database
	OPENID: KVNamespace
	/* eslint-enable no-undef */
}

export interface JWTClaims {
	assassin: {
		admin: boolean
		user: boolean
	}
	first_name: string
}
