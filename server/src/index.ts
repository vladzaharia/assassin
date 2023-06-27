import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { Bindings } from './types'
import { ResetGame } from './routes/room/reset'
import { StartGame } from './routes/room/start'
import { GetPlayer } from './routes/player/get'
import { AddPlayer } from './routes/player/add'
import { RoomStatus } from './routes/room/status'
import { ListRooms } from './routes/room/list'
import { AddRoom } from './routes/room/add'
import { GetRoom } from './routes/room/get'
import { DeleteRoom } from './routes/room/delete'
import { ListWordLists } from './routes/wordlist/list'
import { GetWordList } from './routes/wordlist/get'
import { AddWordList } from './routes/wordlist/add'
import { DeleteWordList } from './routes/wordlist/delete'
import { AddWordsToList } from './routes/wordlist/addWords'
import { DeleteWordsFromList } from './routes/wordlist/deleteWords'
import { Ok } from './routes/ok'
import { DeletePlayer } from './routes/player/delete'

const app = new Hono<{ Bindings: Bindings }>()

// #region Middlewares
// Add CORS to all requests
app.use(
	'*',
	cors({
		origin: '*',
	})
)
// #endregion

// Simple Ok response
app.get('/api', Ok)
app.get('/api/', Ok)

// List rooms
app.get('/api/room/', ListRooms)

// Get/Add/Delete room
app.get('/api/room/:room', GetRoom)
app.put('/api/room/:room', AddRoom)
app.delete('/api/room/:room', DeleteRoom)

// Execute action on room
app.get('/api/room/:room/status', RoomStatus)
app.post('/api/room/:room/reset', ResetGame)
app.post('/api/room/:room/start', StartGame)

// Get/add/delete player
app.get('/api/room/:room/player/:name', GetPlayer)
app.put('/api/room/:room/player/:name', AddPlayer)
app.delete('/api/room/:room/player/:name', DeletePlayer)

// List word lists
app.get('/api/wordlist', ListWordLists)

// Get/add/delete word lists
app.get('/api/wordlist/:list', GetWordList)
app.put('/api/wordlist/:list', AddWordList)
app.delete('/api/wordlist/:list', DeleteWordList)

// Add/delete words from word lists
app.put('/api/wordlist/:list/words', AddWordsToList)
app.delete('/api/wordlist/:list/words', DeleteWordsFromList)

// App
app.get(
	'/*',
	serveStatic({
		root: './',
	})
)

export default app
