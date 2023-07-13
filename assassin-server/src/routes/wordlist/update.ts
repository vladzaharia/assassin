import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createRoomsTable } from '../../tables/room'
import { findWordList, setDescription, setIcon } from '../../tables/wordlist'

interface UpdateWordListBody {
	description?: string
	icon?: string
}

export const UpdateWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const { description, icon } = await c.req.json<UpdateWordListBody>()
		const db = c.env.D1DATABASE

		// Create D1 table if needed
		await createRoomsTable(db)

		const wordList = await findWordList(db, list)
		if (!wordList) {
			return c.json({ message: 'Word list does not exist!' }, 404)
		}

		if (description !== undefined) {
			await setDescription(db, list, description)
		}

		if (icon !== undefined) {
			await setIcon(db, list, icon)
		}

		return c.json({ message: 'Successfully updated wordlist!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
