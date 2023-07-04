import arrayShuffle from 'array-shuffle'
import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, listPlayersInRoom, setTarget } from '../../tables/player'
import { createRoomsTable, findRoom, setStatus } from '../../tables/room'

export const StartGame = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { room } = c.req.param()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createPlayerTable(db)
		await createRoomsTable(db)

		// Try to find room
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		}

		const results = await listPlayersInRoom(db, room)

		if (results && results.length > 2) {
			// Check if targets have been assigned
			if (roomRecord.status !== 'not-ready') {
				return c.json({ message: 'Game has already started!' }, 400)
			}

			const matched: string[] = []

			// Match people
			for (const result of results) {
				const unmatched = results.filter((r) => !matched.includes(r?.name) && r?.name !== result?.name)

				console.log('matched', matched)
				console.log('unmatched', unmatched)

				result.target = arrayShuffle(unmatched)[0]?.name
				console.log(`${result?.name} => ${result.target}`)
				matched.push(result.target)
			}

			// Update player records
			for (const result of results) {
				await setTarget(db, room, result.name, result.target!)
			}

			// Update room record
			await setStatus(db, room, 'started')

			return c.json({ message: 'Successfully started game!' })
		} else {
			return c.json({ message: 'Must have at least 3 people signed up!' }, 400)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
