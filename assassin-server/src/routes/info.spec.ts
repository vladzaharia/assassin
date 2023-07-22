import { Context } from 'hono'
import { Bindings } from '../bindings'
import { Info } from './info'
import { BASE_URL, createContext } from '../testutil'

describe("Info", () => {
	let context: Context<{ Bindings: Bindings }>
	beforeEach(() => {
		context = createContext()
	})

	test("returns deployment info", async () => {
		const result = await Info(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.env).toEqual("test")

		// Check URLs
		expect(Object.keys(resultJson.urls).length).toEqual(5)
		expect(resultJson.urls.ui).toEqual(`${BASE_URL}`)
		expect(resultJson.urls.admin).toEqual(`${BASE_URL}/admin`)
		expect(resultJson.urls.api).toEqual(`${BASE_URL}/api`)
		expect(resultJson.urls.openapi).toEqual(`${BASE_URL}/api/openapi/openapi.swagger`)
		expect(resultJson.urls.docs).toEqual(`${BASE_URL}/api/openapi`)

		// Check deployment
		expect(resultJson.deployment?.version?.app).toEqual("0.0.1")
		expect(resultJson.deployment?.version?.server).toEqual("0.0.2")
		expect(resultJson.deployment?.time).toEqual(1672560000)
		expect(resultJson.deployment?.git?.ref).toEqual("refs/heads/test-branch")
		expect(resultJson.deployment?.git?.sha).toEqual("1234567890abcdef")
		expect(resultJson.deployment?.git?.source).toEqual("local")
	})

	test("missing deployment info", async () => {
		context.env.CONFIG.get = () => undefined

		const result = await Info(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.deployment).toBeUndefined()
	})

	test("missing ENVIRONMENT", async () => {
		context.env.ENVIRONMENT = undefined

		const result = await Info(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.env).toEqual("local")
	})

	test("missing BASE_URL", async () => {
		context.env.BASE_URL = undefined

		const result = await Info(context)
		const resultJson = await result.json()

		expect(result.status).toEqual(200)
		expect(resultJson.urls).toBeUndefined()
	})
})
