import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'

import { AuthMiddleware } from './auth'
import { Bindings } from './bindings'
import { GetUninitializedWordLists, InitializeWordlists } from './routes/wordlist/import'
import { ResetDb } from './routes/db/reset'
import { Info } from './routes/info'
import { AddPlayer } from './routes/player/add'
import { DeletePlayer } from './routes/player/delete'
import { EliminatePlayer } from './routes/player/eliminate'
import { GetPlayer } from './routes/player/get'
import { AddRoom } from './routes/room/add'
import { DeleteRoom } from './routes/room/delete'
import { GetRoom } from './routes/room/get'
import { AssignGM } from './routes/room/gm'
import { ListRooms } from './routes/room/list'
import { ResetGame } from './routes/room/reset'
import { StartGame } from './routes/room/start'
import { UpdateRoom } from './routes/room/update'
import { AddWordList } from './routes/wordlist/add'
import { DeleteWordList } from './routes/wordlist/delete'
import { GetWordList } from './routes/wordlist/get'
import { ListWordLists } from './routes/wordlist/list'
import { AddWord } from './routes/wordlist/word/add'
import { AddWords } from './routes/wordlist/word/addWords'
import { DeleteWord } from './routes/wordlist/word/delete'
import { DeleteWords } from './routes/wordlist/word/deleteWords'
import { UpdateWordList } from './routes/wordlist/update'

const app = new Hono<{ Bindings: Bindings }>()

// #region Middlewares
// Add CORS to all requests
app.use(
	'*',
	cors({
		origin: '*',
	})
)

// JWT Authentication for specific paths
app.use('/api/*', AuthMiddleware)
// #endregion

// Simple Ok response
app.get('/api', Info)
app.get('/api/', Info)

// List rooms
app.get('/api/room', ListRooms)
app.get('/api/room/', ListRooms)

// Get/Add/Update/Delete room
app.get('/api/room/:room', GetRoom)
app.put('/api/room/:room', AddRoom)
app.patch('/api/room/:room', UpdateRoom)
app.delete('/api/room/:room', DeleteRoom)

// Set room GM
app.put('/api/room/:room/gm', AssignGM)
app.put('/api/room/:room/gm/', AssignGM)
app.put('/api/room/:room/gm/:name', AssignGM)

// Execute action on room
app.post('/api/room/:room/reset', ResetGame)
app.post('/api/room/:room/start', StartGame)

// Get/add/delete player
app.get('/api/room/:room/player/:name', GetPlayer)
app.put('/api/room/:room/player/:name', AddPlayer)
app.delete('/api/room/:room/player/:name', DeletePlayer)
app.post('/api/room/:room/player/:name/eliminate', EliminatePlayer)

// List word lists
app.get('/api/wordlist', ListWordLists)
app.get('/api/wordlist/', ListWordLists)

// Import word lists
app.get('/api/wordlist/import', GetUninitializedWordLists)
app.put('/api/wordlist/import/:importList', InitializeWordlists)

// Get/add/delete word lists
app.get('/api/wordlist/:list', GetWordList)
app.put('/api/wordlist/:list', AddWordList)
app.patch('/api/wordlist/:list', UpdateWordList)
app.delete('/api/wordlist/:list', DeleteWordList)

// Add/delete words from word lists
app.put('/api/wordlist/:list/word/:word', AddWord)
app.delete('/api/wordlist/:list/word/:word', DeleteWord)
app.put('/api/wordlist/:list/words', AddWords)
app.delete('/api/wordlist/:list/words', DeleteWords)

// Database endpoints
app.put('/api/db/reset', ResetDb)

// OpenAPI
app.get(
	'/api/openapi/*',
	serveStatic({
		path: './openapi',
	})
)

// App
app.get(
	'/admin',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/room',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/room/:roomId',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/wordlist',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/wordlist/:listId',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/admin/database',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/room/',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/room/:roomId',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/room/:roomId/settings',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/room/:roomId/mission',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/room/:roomId/complete',
	serveStatic({
		path: './app/index.html',
	})
)
app.get(
	'/*',
	serveStatic({
		root: './app',
	})
)

export default app
