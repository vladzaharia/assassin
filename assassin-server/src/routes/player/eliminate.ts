import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { findPlayer, setStatus, setTarget, setWords } from '../../tables/player'
import { findRoom, setStatus as setRoomStatus } from '../../tables/room'

export const EliminatePlayer = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { name, room } = c.req.param()
		const { word } = await c.req.json<{ word: string }>()
		const db = c.env.D1DATABASE

		// Check if room exists
		const roomRecord = await findRoom(db, room)
		if (!roomRecord) {
			return c.json({ message: 'Room not found!' }, 404)
		} else if (roomRecord.status !== 'started') {
			return c.json({ message: 'Game has not started!' }, 400)
		}

		// Check if player exists
		const player = await findPlayer(db, room, name)
		if (!player) {
			return c.json({ message: 'Player not found!' }, 404)
		} else if (player.status !== 'alive') {
			return c.json({ message: 'Player is not alive!' }, 400)
		}

		// Check if word is available for use
		if (roomRecord.usesWords === 1) {
			const words: string[] = JSON.parse(player.words!)
			if (!words.includes(word)) {
				return c.json({ message: 'Word is not available for use!' }, 400)
			}
		}

		// Eliminate target
		const targetName = player.target!
		const target = await findPlayer(db, room, targetName)
		if (!target) {
			return c.json({ message: 'Target not found!' }, 404)
		}
		await setStatus(db, room, targetName, 'eliminated')

		// Check if there's targets available
		if (target.target! === player.name) {
			await setStatus(db, room, name, 'champion')
			await setRoomStatus(db, room, 'completed')
			return c.json({ message: 'Congratulations, you have won the game!' }, 299)
		}

		// Assign target's target
		await setTarget(db, room, name, target.target!)

		// Add target's words to player's
		if (roomRecord.usesWords === 1) {
			const oldWords: string[] = JSON.parse(player.words!).filter((w: string) => w !== word)
			const targetWords: string = JSON.parse(target!.words!)

			await setWords(db, room, name, [...oldWords, ...targetWords])
		}

		return c.json({ message: `Successfully eliminated ${targetName}!` })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
