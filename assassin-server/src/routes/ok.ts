import { Context } from 'hono'
import { Bindings } from '../bindings'

export const Ok = async (c: Context<{ Bindings: Bindings }>) => {
	return c.json({ message: 'ok' }, 200)
}
