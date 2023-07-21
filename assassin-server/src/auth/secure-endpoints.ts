export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type AuthType = 'gm' | 'player' | 'jwt'

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
			authTypes: ['jwt'],
		},
		{
			path: /room\/\w*$/,
			methods: ['PUT', 'DELETE'],
			authTypes: ['jwt'],
		},
		{
			path: /room\/\w*$/,
			methods: ['PATCH'],
			authTypes: ['gm', 'jwt'],
		},
		{
			path: /room\/\w*\/player\/\w*$/,
			methods: ['DELETE'],
			authTypes: ['player', 'gm', 'jwt'],
		},
		{
			path: /room\/\w*\/player\/\w*$/,
			methods: ['GET', 'PUT'],
			authTypes: ['player', 'jwt'],
		},
		{
			path: /room\/\w*\/player\/\w*\/eliminate$/,
			methods: ['POST'],
			authTypes: ['player', 'jwt'],
		},
		{
			path: /room\/\w*\/(start|reset)$/,
			methods: ['POST'],
			authTypes: ['gm', 'jwt'],
		},
		{
			path: /room\/\w*\/gm\/?(\w+)?$/,
			methods: ['POST'],
			authTypes: ['gm', 'jwt'],
		},
		{
			path: /wordlist\/\w*$/,
			methods: ['PUT', 'DELETE', 'PATCH'],
			authTypes: ['jwt'],
		},
		{
			path: /wordlist\/import\/\w*$/,
			methods: ['PUT'],
			authTypes: ['jwt'],
		},
		{
			path: /wordlist\/\w*\/words$/,
			methods: ['PUT', 'DELETE'],
			authTypes: ['jwt'],
		},
	]
}
