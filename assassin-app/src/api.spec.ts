import { AdminApi, Configuration, DatabaseApi, GMApi, InfoApi, PlayerApi, RoomApi, WordlistApi } from 'assassin-server-client';
import { createAdminApi, createAdminOrGMApi, createDatabaseApi, createGMApi, createInfoApi, createPlayerApi, createRoomApi, createWordlistApi, getApiConfig } from './api'

interface DebugApi {
	configuration: Configuration
}

beforeEach(() => {
	Object.defineProperty(window, 'location', {
		configurable: true,
		enumerable: true,
		value: new URL("https://local.assassin.vlad.gg/"),
	});
})

describe("getApiConfig", () => {
	test("Creates base path from window.location", () => {
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
		const config = getApiConfig({ apiKey: "passed-in-key" })
		expect(config.apiKey).toBe("passed-in-key")
	})

	test("Access token passed in appropriately", () => {
		const config = getApiConfig({ accessToken: "passed-in-token" })
		expect(config.accessToken).toBe("passed-in-token")
	})
})

describe('createAdminOrGMApi', () =>{
	test('creates GM API when apiType is set to gm', () => {
		const api = createAdminOrGMApi("gm", "PlayerName", "some-api-key") as unknown as DebugApi

		expect(api instanceof GMApi).toBeTruthy()
		expect(api.configuration.apiKey).toBe("PlayerName")
		expect(api.configuration.accessToken).toBeUndefined()
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('passes through apiKey is set to gm', () => {
		const api = createAdminOrGMApi("gm", "AnotherPlayer", "some-api-key") as unknown as DebugApi
		expect(api.configuration.apiKey).toBe("AnotherPlayer")
	})

	test('creates Admin API when apiType is set to admin', () => {
		const api = createAdminOrGMApi("admin", "PlayerName", "some-api-key") as unknown as DebugApi

		expect(api instanceof AdminApi).toBeTruthy()
		expect(api.configuration.apiKey).toBeUndefined()
		expect(api.configuration.accessToken).toBe("some-api-key")
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('passes through apiKey is set to admin', () => {
		const api = createAdminOrGMApi("admin", "SomePlayer", "another-api-key") as unknown as DebugApi
		expect(api.configuration.accessToken).toBe("another-api-key")
	})
})

describe('createAdminApi', () =>{
	test('creates admin API', () => {
		const api = createAdminApi("some-test-token") as unknown as DebugApi

		expect(api instanceof AdminApi).toBeTruthy()
		expect(api.configuration.accessToken).toBe("some-test-token")
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('token is passed through', () => {
		const api = createAdminApi("another-test-token") as unknown as DebugApi
		expect(api.configuration.accessToken).toBe("another-test-token")
	})

	test('apiKey is not set', () => {
		const api = createAdminApi("some-test-token") as unknown as DebugApi
		expect(api.configuration.apiKey).toBeUndefined()
	})
})

describe('createDatabaseApi', () =>{
	test('creates database API', () => {
		const api = createDatabaseApi("some-test-token") as unknown as DebugApi

		expect(api instanceof DatabaseApi).toBeTruthy()
		expect(api.configuration.accessToken).toBe("some-test-token")
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('token is passed through', () => {
		const api = createDatabaseApi("another-test-token") as unknown as DebugApi
		expect(api.configuration.accessToken).toBe("another-test-token")
	})

	test('apiKey is not set', () => {
		const api = createDatabaseApi("some-test-token") as unknown as DebugApi
		expect(api.configuration.apiKey).toBeUndefined()
	})
})

describe('createGMApi', () =>{
	test('creates GM API', () => {
		const api = createGMApi("PlayerName") as unknown as DebugApi

		expect(api instanceof GMApi).toBeTruthy()
		expect(api.configuration.apiKey).toBe("PlayerName")
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('apiKey is passed through', () => {
		const api = createGMApi("AnotherPlayer") as unknown as DebugApi
		expect(api.configuration.apiKey).toBe("AnotherPlayer")
	})

	test('accessToken is not set', () => {
		const api = createGMApi("PlayerName") as unknown as DebugApi
		expect(api.configuration.accessToken).toBeUndefined()
	})
})

describe('createInfoApi', () =>{
	test('creates info API', () => {
		const api = createInfoApi() as unknown as DebugApi

		expect(api instanceof InfoApi).toBeTruthy()
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('apiKey is not set', () => {
		const api = createInfoApi() as unknown as DebugApi
		expect(api.configuration.apiKey).toBeUndefined()
	})

	test('accessToken is not set', () => {
		const api = createInfoApi() as unknown as DebugApi
		expect(api.configuration.accessToken).toBeUndefined()
	})
})

describe('createPlayerApi', () =>{
	test('creates Player API', () => {
		const api = createPlayerApi("PlayerName") as unknown as DebugApi

		expect(api instanceof PlayerApi).toBeTruthy()
		expect(api.configuration.apiKey).toBe("PlayerName")
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('apiKey is passed through', () => {
		const api = createPlayerApi("AnotherPlayer") as unknown as DebugApi
		expect(api.configuration.apiKey).toBe("AnotherPlayer")
	})

	test('accessToken is not set', () => {
		const api = createPlayerApi("PlayerName") as unknown as DebugApi
		expect(api.configuration.accessToken).toBeUndefined()
	})
})

describe('createRoomApi', () =>{
	test('creates room API', () => {
		const api = createRoomApi() as unknown as DebugApi

		expect(api instanceof RoomApi).toBeTruthy()
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('apiKey is not set', () => {
		const api = createRoomApi() as unknown as DebugApi
		expect(api.configuration.apiKey).toBeUndefined()
	})

	test('accessToken is not set', () => {
		const api = createRoomApi() as unknown as DebugApi
		expect(api.configuration.accessToken).toBeUndefined()
	})
})

describe('createWordlistApi', () =>{
	test('creates wordlist API', () => {
		const api = createWordlistApi() as unknown as DebugApi

		expect(api instanceof WordlistApi).toBeTruthy()
		expect(api.configuration.basePath).toBe("https://local.assassin.vlad.gg/api")
	})

	test('apiKey is not set', () => {
		const api = createWordlistApi() as unknown as DebugApi
		expect(api.configuration.apiKey).toBeUndefined()
	})

	test('accessToken is not set', () => {
		const api = createWordlistApi() as unknown as DebugApi
		expect(api.configuration.accessToken).toBeUndefined()
	})
})
