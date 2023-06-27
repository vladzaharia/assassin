import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { Bindings } from './types'
import { ResetGame } from './routes/room/reset'
import { StartGame } from './routes/room/start'
import { GetPlayer } from './routes/player/get'
import { AddPlayer } from './routes/player/add'
import { GameStatus } from './routes/room/status'
import { ListRooms } from './routes/room/list'
import { AddRoom } from './routes/room/add'
import { GetRoom } from './routes/room/get'

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

// app.get('/api', GameStatus)
// app.get('/api/', GameStatus)

app.get('/api/room/', ListRooms)

app.get('/api/room/:room', GetRoom)
app.put('/api/room/:room', AddRoom)
app.delete('/api/room/:room', GameStatus)

app.post('/api/room/:room/reset', ResetGame)
app.post('/api/room/:room/start', StartGame)

app.get('/api/room/:room/player/:name', GetPlayer)
app.put('/api/room/:room/player/:name', AddPlayer)

// App
app.get(
	'/*',
	serveStatic({
		root: './',
	})
)

export default app
