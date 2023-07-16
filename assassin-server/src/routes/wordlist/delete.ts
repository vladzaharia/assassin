import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { deleteWordsInWordList } from '../../tables/word'
import { deleteWordList, findWordList } from '../../tables/wordlist'

export const DeleteWordList = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const { list } = c.req.param()
		const db = c.env.D1DATABASE

		// Try to find word list
		const record = await findWordList(db, list)
		if (!record) {
			return c.json({ message: 'Word list not found!' }, 404)
		}

		// Delete word list
		await deleteWordsInWordList(db, list)
		await deleteWordList(db, list)
		return c.json({ message: 'Successfully deleted word list!' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
