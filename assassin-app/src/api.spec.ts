import { getApiConfig } from './api'

describe("getApiConfig", () => {
	test("Creates base path from window.location", () => {
		Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL("https://local.assassin.vlad.gg/"),
    });

		const config = getApiConfig()
		expect(config.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test("Replaces localhost port appropriately", () => {
		Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL("http://localhost:4200"),
    });

		const config = getApiConfig()
		expect(config.basePath).toBe("http://localhost:8787/api")
	})

	test("API key passed in appropriately", () => {
		Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL("https://local.assassin.vlad.gg/"),
    });

		const config = getApiConfig({ apiKey: "passed-in-key" })
		expect(config.apiKey).toBe("passed-in-key")
	})

	test("Access token passed in appropriately", () => {
		Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL("https://local.assassin.vlad.gg/"),
    });

		const config = getApiConfig({ accessToken: "passed-in-token" })
		expect(config.accessToken).toBe("passed-in-token")
	})
})
