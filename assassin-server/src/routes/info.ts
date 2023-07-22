import { Context } from 'hono'
import { Bindings } from '../bindings'
import { DeploymentInfo } from '../types'

export const Info = async (c: Context<{ Bindings: Bindings }>) => {
	let deployment: DeploymentInfo | undefined = undefined

	const deploymentJSON = await c.env.CONFIG.get('deployment')
	if (deploymentJSON) {
		deployment = JSON.parse(deploymentJSON) as DeploymentInfo
	}

	return c.json(
		{
			env: c.env.ENVIRONMENT || 'local',
			deployment,
			urls: c.env.BASE_URL
				? {
						ui: `${c.env.BASE_URL}`,
						admin: `${c.env.BASE_URL}/admin`,
						api: `${c.env.BASE_URL}/api`,
						openapi: `${c.env.BASE_URL}/api/openapi/openapi.swagger`,
						docs: `${c.env.BASE_URL}/api/openapi`,
				  }
				: undefined,
		},
		200
	)
}
