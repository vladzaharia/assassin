import { Context } from 'hono'
import { Bindings } from '../bindings'

export const Info = async (c: Context<{ Bindings: Bindings }>) => {
	const gitRepository = await c.env.CONFIG.get('git-repository')
	const gitRef = await c.env.CONFIG.get('git-ref')
	const gitSha = await c.env.CONFIG.get('git-sha')

	let git = undefined

	if (gitRepository && gitRef && gitSha) {
		git = {
			source: gitRepository,
			ref: gitRef,
			sha: gitSha,
		}
	}

	const versionApp = await c.env.CONFIG.get('version-app')
	const versionServer = await c.env.CONFIG.get('version-server')
	const deploymentTime = await c.env.CONFIG.get('deployment-time')
	let deployment = undefined

	if (versionApp && versionServer && deploymentTime) {
		deployment = {
			app: versionApp,
			server: versionServer,
			time: parseInt(deploymentTime, 10),
			git,
		}
	}

	return c.json(
		{
			env: c.env.ENVIRONMENT || 'local',
			deployment,
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
