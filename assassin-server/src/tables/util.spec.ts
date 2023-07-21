import { converIntToBool, convertBoolToInt } from './util'

describe('convertBoolToInt', () => {
	test('true => 1', () => {
		expect(convertBoolToInt(true)).toBe(1)
	})

	test('false => 0', () => {
		expect(convertBoolToInt(false)).toBe(0)
	})
})

describe('convertIntToBool', () => {
	test('1 => true', () => {
		expect(converIntToBool(1)).toBe(true)
	})

	test('0 => false', () => {
		expect(converIntToBool(0)).toBe(false)
	})
})
