import { Context } from 'hono'
import { Bindings } from '../bindings'

export const Info = async (c: Context<{ Bindings: Bindings }>) => {
	return c.json(
		{
			version: '0.1.0',
			env: c.env.ENVIRONMENT || 'local',
			urls: {
				ui: `${c.env.BASE_URL}`,
				admin: `${c.env.BASE_URL}/admin`,
				api: `${c.env.BASE_URL}/api`,
				openapi: `${c.env.BASE_URL}/api/openapi/openapi.swagger`,
				docs: `${c.env.BASE_URL}/api/openapi`,
			},
		},
		200
	)
}
