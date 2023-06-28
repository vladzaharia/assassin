import { Context } from 'hono'

export const Ok = async (c: Context) => {
	return c.json({ message: 'ok' }, 200)
}
