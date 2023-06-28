import arrayShuffle from 'array-shuffle'
import { Context } from 'hono'
import { Bindings } from '../../types'
import { createPlayerTable, listPlayersInRoom, setPlayerTarget } from '../../tables/player'
import { createRoomsTable, findRoom } from '../../tables/room'

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

		const results = (await listPlayersInRoom(db, room)).results
		if (results && results.length > 1) {
			// Check if targets have been assigned
			if (results[0].target) {
				return c.json({ message: 'Game already started!' }, 400)
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

			// Update records
			for (const result of results) {
				await setPlayerTarget(db, result.name, room, result.target!)
			}

			return c.json({ message: 'ok' })
		} else {
			return c.json({ message: 'Must have at least 2 people signed up!' }, 400)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
