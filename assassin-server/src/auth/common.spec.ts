import { AuthException } from './common'

describe('AuthException', () => {
	test('returns resposnse', () => {
		const exception = new AuthException('Test message', 599)
		expect(exception.getResponse().status).toEqual(599)
		expect(exception.getResponse().text()).resolves.toEqual('Test message')
	})

	test('message is passed through', () => {
		const exception = new AuthException('Another message goes here', 599)
		expect(exception.getResponse().text()).resolves.toEqual('Another message goes here')
	})

	test('status code is passed through', () => {
		const exception = new AuthException('Test message', 499)
		expect(exception.getResponse().status).toEqual(499)
	})
})
