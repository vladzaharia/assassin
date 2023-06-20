import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { Bindings } from './types'
import { ResetGame } from './routes/reset'
import { StartGame } from './routes/start'
import { GetPlayer } from './routes/get'
import { AddPlayer } from './routes/add'
import { GameStatus } from './routes/status'

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

app.get('/api', GameStatus)
app.get('/api/', GameStatus)
app.post('/api/reset', ResetGame)
app.post('/api/start', StartGame)
app.get('/api/player/:name', GetPlayer)
app.put('/api/player/:name', AddPlayer)

// App
app.get(
	'/*',
	serveStatic({
		root: './',
	})
)

export default app
