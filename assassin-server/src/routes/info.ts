import { Context } from 'hono'
import { Bindings } from '../bindings'

export const Info = async (c: Context<{ Bindings: Bindings }>) => {
	const gitRepository = await c.env.CONFIG.get('git-repository')
	const gitRef = await c.env.CONFIG.get('git-ref')
	const gitSha = await c.env.CONFIG.get('git-sha')

	let git = undefined

	if (gitRepository && gitRef && gitSha) {
		git = {
			repository: gitRepository,
			ref: gitRef,
			sha: gitSha,
		}
	}

	const versionApp = await c.env.CONFIG.get('version-app')
	const versionServer = await c.env.CONFIG.get('version-server')

	let version = undefined

	if (versionApp && versionServer) {
		version = {
			app: versionApp,
			server: versionServer,
		}
	}

	return c.json(
		{
			version,
			env: c.env.ENVIRONMENT || 'local',
			urls: {
				ui: `${c.env.BASE_URL}`,
				admin: `${c.env.BASE_URL}/admin`,
				api: `${c.env.BASE_URL}/api`,
				openapi: `${c.env.BASE_URL}/api/openapi/openapi.swagger`,
				docs: `${c.env.BASE_URL}/api/openapi`,
			},
			git,
		},
		200
	)
}
