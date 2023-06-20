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

app.get('/', GameStatus)
app.post('/reset', ResetGame)
app.post('/start', StartGame)
app.get('/player/:name', GetPlayer)
app.put('/player/:name', AddPlayer)

// App
app.get(
	'/app/*',
	serveStatic({
		root: './',
	})
)

export default app
