import { Context } from "hono";
import { Bindings } from "../bindings";
import { findRoomGM } from "../tables/player";
import { findRoom } from "../tables/room";
import { AuthException } from "./common";

export const GMAuth = async (c: Context<{ Bindings: Bindings }>) => {
	const { room } = c.req.param()
	const name = c.req.header('X-Assassin-User')

	const roomRecord = await findRoom(c.env.D1DATABASE, room)
	if (!roomRecord) {
		console.log('Room not found')
		throw new AuthException('Room not found!', 404)
	}
	console.log(`Room found; ${roomRecord}`)
	const roomGM = await findRoomGM(c.env.D1DATABASE, room)

	console.log(`GM Auth: ${name}, gm = ${roomGM?.name}`)
	return roomGM?.name === name

}
