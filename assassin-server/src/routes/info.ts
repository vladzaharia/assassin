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

	const deploymentTime = await c.env.CONFIG.get('deployment-time')

	const deployment = {
		app: await c.env.CONFIG.get('version-app'),
		server: await c.env.CONFIG.get('version-server'),
		time: deploymentTime && parseInt(deploymentTime, 10),
		git,
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
