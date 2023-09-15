import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { AssignGM } from './gm'
import { createContext, modifyContext } from '../../testutil'
import { vi } from 'vitest'
import { PlayerTable, RoomTable } from '../../tables/db'

const mocks = vi.hoisted(() => {
	return {
		setGMStatus: vi.fn(),
		listPlayersInRoom: vi.fn().mockImplementation(async () => {
			return [
				{
					name: 'test-player',
					room: 'test-room',
					isGM: 1,
					status: 'alive',
				},
				{
					name: 'test-player-2',
					room: 'test-room',
					isGM: 0,
					status: 'alive',
				},
			] as PlayerTable[]
		}),
		findRoomGM: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-player',
				room: 'test-room',
				isGM: 1,
				status: 'alive',
			} as PlayerTable
		}),
		findPlayer: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-player-2',
				room: 'test-room',
				isGM: 0,
				status: 'alive',
			} as PlayerTable
		}),
		findRoom: vi.fn().mockImplementation(async () => {
			return {
				name: 'test-room',
				status: 'not-ready',
				numWords: 0,
				usesWords: 0,
				wordlists: JSON.stringify([]),
			} as RoomTable
		}),
	}
})

vi.mock('../../tables/player', () => {
	return {
		setGMStatus: mocks.setGMStatus,
		findPlayer: mocks.findPlayer,
		findRoomGM: mocks.findRoomGM,
		listPlayersInRoom: mocks.listPlayersInRoom,
	}
})

vi.mock('../../tables/room', () => {
	return {
		findRoom: mocks.findRoom,
	}
})

afterEach(() => {
	// Clear mock data
	vi.clearAllMocks()
})

describe('AssignGM', () => {
	let context: Context<{ Bindings: Bindings }>

	beforeEach(() => {
		context = createContext({
			req: {
				param: () => {
					return { room: 'test-room', name: 'test-player' }
				},
			},
		} as unknown as Context<{ Bindings: Bindings }>)
	})

	describe('findRoom', async () => {
		test('calls method', async () => {
			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoom).toBeCalledTimes(1)
			expect(mocks.findRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('findRoomGM', async () => {
		test('calls method', async () => {
			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoomGM).toBeCalledTimes(1)
			expect(mocks.findRoomGM).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.findRoomGM).toBeCalledTimes(1)
			expect(mocks.findRoomGM).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('listPlayersInRoom', async () => {
		test('calls method', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'test-room' }
			})

			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.listPlayersInRoom).toBeCalledTimes(1)
			expect(mocks.listPlayersInRoom).toBeCalledWith(undefined, 'test-room')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})

			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.listPlayersInRoom).toBeCalledTimes(1)
			expect(mocks.listPlayersInRoom).toBeCalledWith(undefined, 'another-room')
		})
	})

	describe('findPlayer', async () => {
		test('calls method', async () => {
			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.findPlayer).toBeCalledTimes(1)
			expect(mocks.findPlayer).toBeCalledWith(undefined, 'test-room', 'test-player')
		})

		test('passed in parameters are used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room', name: 'test-player-2' }
			})

			const result = await AssignGM(context)

			expect(result.status).toEqual(200)
			expect(mocks.findPlayer).toBeCalledTimes(1)
			expect(mocks.findPlayer).toBeCalledWith(undefined, 'another-room', 'test-player-2')
		})
	})

	describe('name parameter', () => {
		test('sets GM to named player', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'test-room', name: 'test-player' }
			})

			const result = await AssignGM(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.message).toEqual('Successfully reassigned GM status!')
			expect(mocks.setGMStatus).toBeCalledTimes(2)
			expect(mocks.setGMStatus).toBeCalledWith(undefined, 'test-room', 'test-player', true)
		})

		test('name parameter is used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'test-room', name: 'test-player-2' }
			})

			const result = await AssignGM(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.message).toEqual('Successfully reassigned GM status!')
			expect(mocks.setGMStatus).toBeCalledTimes(2)
			expect(mocks.setGMStatus).toBeCalledWith(undefined, 'test-room', 'test-player-2', true)
		})
	})

	describe('no name parameter', () => {
		test('randomly reassigned to non-GM user', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'test-room' }
			})
			mocks.listPlayersInRoom.mockImplementationOnce(async () => {
				return [
					{
						name: 'test-player',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
					{
						name: 'test-player-454',
						room: 'test-room',
						isGM: 0,
						status: 'alive',
					},
				] as PlayerTable[]
			})

			const result = await AssignGM(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.message).toEqual('Successfully reassigned GM status!')
			expect(mocks.setGMStatus).toBeCalledTimes(2)
			expect(mocks.setGMStatus).toBeCalledWith(undefined, 'test-room', 'test-player-454', true)
		})

		test('room parameter is used', async () => {
			modifyContext(context, '$.req.param', () => {
				return { room: 'another-room' }
			})
			mocks.listPlayersInRoom.mockImplementationOnce(async () => {
				return [
					{
						name: 'test-player',
						room: 'test-room',
						isGM: 1,
						status: 'alive',
					},
					{
						name: 'test-player-454',
						room: 'test-room',
						isGM: 0,
						status: 'alive',
					},
				] as PlayerTable[]
			})

			const result = await AssignGM(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(200)
			expect(resultJson.message).toEqual('Successfully reassigned GM status!')
			expect(mocks.setGMStatus).toBeCalledTimes(2)
			expect(mocks.setGMStatus).toBeCalledWith(undefined, 'another-room', 'test-player-454', true)
		})
	})

	describe('errors', () => {
		test('generic error', async () => {
			mocks.findRoom.mockImplementationOnce(() => {
				throw new Error('The apocalypse is upon us')
			})

			const result = await AssignGM(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(500)
			expect(resultJson.message).toEqual('Something went wrong!')
		})

		test('room not found', async () => {
			mocks.findRoom.mockImplementationOnce(() => undefined)

			const result = await AssignGM(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Room not found!')
		})

		test('new player not found', async () => {
			mocks.findPlayer.mockImplementationOnce(async () => undefined)

			const result = await AssignGM(context)
			const resultJson = await result.json()

			expect(result.status).toEqual(404)
			expect(resultJson.message).toEqual('Player not found!')
		})
	})
})
