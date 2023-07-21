import { getRoomStatus } from './util'
import { PlayerTable } from './tables/db'

const playerRecord: PlayerTable = {
	name: "player",
	isGM: 0,
	room: "test",
	status: "alive"
}

describe('getRoomStatus', () => {
	test('returns ready if not-ready and enough players', () => {
		const response = getRoomStatus('not-ready', [playerRecord, playerRecord, playerRecord])
		expect(response).toBe('ready')
	})

	test('returns not-ready if not-ready and not enough players', () => {
		const response = getRoomStatus('not-ready', [playerRecord])
		expect(response).toBe('not-ready')
	})

	test('returns passed in status if not not-ready (completed)', () => {
		const response = getRoomStatus('completed', [playerRecord, playerRecord, playerRecord])
		expect(response).toBe('completed')
	})

	test('returns passed in status if not not-ready (started)', () => {
		const response = getRoomStatus('started', [playerRecord, playerRecord, playerRecord])
		expect(response).toBe('started')
	})
})
