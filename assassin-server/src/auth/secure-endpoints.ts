export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type AuthType = 'gm' | 'player' | 'admin'

export interface SecureEndpoint {
	path: RegExp
	methods: HTTPMethods[]
	authTypes: AuthType[]
}

export function getSecureEndpoints(): SecureEndpoint[] {
	return [
		{
			path: /db.*$/,
			methods: ['POST', 'PUT', 'DELETE'],
			authTypes: ['admin'],
		},
		{
			path: /room\/\w*$/,
			methods: ['PUT', 'DELETE'],
			authTypes: ['admin'],
		},
		{
			path: /room\/\w*$/,
			methods: ['PATCH'],
			authTypes: ['gm', 'admin'],
		},
		{
			path: /room\/\w*\/player\/\w*$/,
			methods: ['DELETE'],
			authTypes: ['player', 'gm', 'admin'],
		},
		{
			path: /room\/\w*\/player\/\w*$/,
			methods: ['GET', 'PUT'],
			authTypes: ['player', 'admin'],
		},
		{
			path: /room\/\w*\/player\/\w*\/eliminate$/,
			methods: ['POST'],
			authTypes: ['player', 'admin'],
		},
		{
			path: /room\/\w*\/(start|reset)$/,
			methods: ['POST'],
			authTypes: ['gm', 'admin'],
		},
		{
			path: /room\/\w*\/gm\/?(\w+)?$/,
			methods: ['POST'],
			authTypes: ['gm', 'admin'],
		},
		{
			path: /wordlist\/\w*$/,
			methods: ['PUT', 'DELETE', 'PATCH'],
			authTypes: ['admin'],
		},
		{
			path: /wordlist\/import\/\w*$/,
			methods: ['PUT'],
			authTypes: ['admin'],
		},
		{
			path: /wordlist\/\w*\/words$/,
			methods: ['PUT', 'DELETE'],
			authTypes: ['admin'],
		},
	]
}
