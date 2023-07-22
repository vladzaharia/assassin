import { HTTPException } from 'hono/http-exception'

export class AuthException extends HTTPException {
	constructor(message: string, status: number) {
		const res = new Response(message, { status })
		super(status, { res })
	}
}
