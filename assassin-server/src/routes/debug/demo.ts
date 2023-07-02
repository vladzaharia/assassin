import { Context } from 'hono'
import { Bindings } from '../../bindings'
import { createPlayerTable, insertPlayer, setPlayerStatus } from '../../tables/player'
import { createRoomsTable, insertRoom } from '../../tables/room'
import { createWordTable, insertWords } from '../../tables/word'
import { createWordListTable, insertWordList } from '../../tables/wordlist'

export const DemoDb = async (c: Context<{ Bindings: Bindings }>) => {
	try {
		const db = c.env.D1DATABASE

		const { room: roomParam, name: nameParam, addWordsParam } = c.req.query()
		const room = roomParam || 'test'
		const name = nameParam || 'Test'
		const addWords = addWordsParam !== 'false'

		// Create D1 tables if needed
		await createRoomsTable(db)
		await createPlayerTable(db)
		await createWordListTable(db)
		await createWordTable(db)

		// Insert demo room
		await insertRoom(db, room)
		await insertPlayer(db, room, name, true)
		await insertPlayer(db, room, 'Foo')
		await insertPlayer(db, room, 'Bar')
		await insertPlayer(db, room, 'Baz')
		await setPlayerStatus(db, room, 'Baz', 'eliminated')

		if (addWords) {
			// Insert demo wordlists
			await insertWordList(db, 'test-list', 'This is a test list', 'vial')
			await insertWordList(db, 'another-list', 'Another test list')

			// Insert demo words
			const testWords = ['test', 'words', 'go', 'here']
			await insertWords(db, 'test-list', testWords)
			const anotherWords = ['foo', 'bar', 'baz', 'foobar']
			await insertWords(db, 'another-list', anotherWords)
		}

		return c.json({ message: 'ok' })
	} catch (e) {
		console.error('err', e)
		return c.json({ message: 'Something went wrong!' }, 500)
	}
}
