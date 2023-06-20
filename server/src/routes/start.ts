import arrayShuffle from 'array-shuffle';
import { Context } from 'hono'
import { AssassinRecord, Bindings } from '../types'

export const StartGame = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const results = (
			await c.env.D1DATABASE.prepare(`SELECT * FROM assassin`)
				.all<AssassinRecord>()
		).results

		if (results && results.length > 1) {
			const matched: string[] = []

			// Match people
			for (const result of results) {
				const unmatched = results.filter((r) => !matched.includes(r?.name) && r?.name !== result?.name)

				console.log("matched", matched)
				console.log("unmatched", unmatched)

				result.target = arrayShuffle(unmatched)[0]?.name
				console.log(`${result?.name} => ${result.target}`)
				matched.push(result.target)
			}

			// Update records
			for (const result of results) {
				await c.env.D1DATABASE.prepare(`UPDATE assassin SET target=? WHERE name=?`)
					.bind(result.name, result.target)
					.run()
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
