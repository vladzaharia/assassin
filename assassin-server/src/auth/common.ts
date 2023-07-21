export class AuthException extends Error {
	readonly res: Response
	constructor(message: string, status: number) {
		super(message)
		this.res = new Response(message, { status })
	}
	getResponse(): Response {
		return this.res
	}
}
