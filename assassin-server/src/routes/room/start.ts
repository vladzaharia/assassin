import arrayShuffle from 'array-shuffle'
import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, deletePlayer, insertPlayer, listPlayersInRoom, setTarget, setWords } from '../../tables/player'
import { createRoomsTable, findRoom, setStatus as setRoomStatus } from '../../tables/room'
import { listWordsInWordLists } from '../../tables/word'

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

		const players = await listPlayersInRoom(db, room)

		if (players && players.length > 2) {
			// Check if game has already started
			if (roomRecord.status === 'started') {
				return c.json({ message: 'Game has already started!' }, 400)
			}

			// Reset room if needed
			if (roomRecord.status === 'completed') {
				for (let i = 0; i < players.length; i++) {
					await deletePlayer(db, room, players[i].name)
					await insertPlayer(db, room, players[i].name, i === 0)
				}
			}

			// Get all words
			const words = await listWordsInWordLists(db, JSON.parse(roomRecord.wordlists))
			const shuffledWords = words
				.map((value) => ({ value, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.map(({ value }) => value)

			if (roomRecord.usesWords === 1 && words.length < players.length * roomRecord.numWords) {
				return c.json({ message: 'There are not enough words to distribute!' }, 400)
			}

			const matched: string[] = []

			// Match people and get words
			for (const result of players) {
				const unmatched = players.filter((r) => !matched.includes(r?.name) && r?.name !== result?.name)

				console.log('matched', matched)
				console.log('unmatched', unmatched)

				result.target = arrayShuffle(unmatched)[0]?.name
				console.log(`${result?.name} => ${result.target}`)
				matched.push(result.target)

				if (roomRecord.usesWords === 1) {
					result.words = JSON.stringify(shuffledWords.splice(0, roomRecord.numWords).map((w) => w.word))
				}
			}

			// Get words

			// Update player records
			for (const result of players) {
				await setTarget(db, room, result.name, result.target!)

				if (result.words) {
					await setWords(db, room, result.name, JSON.parse(result.words))
				}
			}

			// Update room record
			await setRoomStatus(db, room, 'started')

			return c.json({ message: 'Successfully started game!' })
		} else {
			return c.json({ message: 'Must have at least 3 people signed up!' }, 400)
		}
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
