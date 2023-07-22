import { Context } from "hono"
import { DeploymentInfo } from "./types"
import { Bindings } from "./bindings"
import { value } from 'jsonpath'

export const BASE_URL = "https://test.assassin.vlad.gg"

export const json = (response: unknown, status: number) => {
	return {
		json: () => response,
		status
	}
}

export const createContext = (overrides?: Partial<Context<{ Bindings: Bindings }>>) => {
	return {
		... overrides,
		env: {
			BASE_URL: BASE_URL,
			ENVIRONMENT: "test",
			ASSASSIN_SECRET: 'env-test-secret',
			OPENID: {
				get: async () => "kv-test-secret",
			},
			CONFIG: {
				get: async () => {
					const deploymentInfo: DeploymentInfo = {
						time: 1672560000,
						version: {
							app: "0.0.1",
							server: "0.0.2"
						},
						git: {
							ref: "refs/heads/test-branch",
							sha: "1234567890abcdef",
							source: "local"
						}
					}
					return JSON.stringify(deploymentInfo)
				},
			},
			... overrides?.env
		} as Bindings,
		json
	} as Context<{ Bindings: Bindings }>
}

export const modifyContext = (context: Context<{Bindings: Bindings}>, key: string, newValue: unknown) => {
	value(context, key, newValue)
}
