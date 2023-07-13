import { Params } from 'react-router-dom'
import { createPlayerApi } from '../api'

export default async function PlayerLoader({ params }: { params: Params }) {
	try {
		const name = localStorage.getItem('name')
		if (name) {
			const playerApi = createPlayerApi(name.replace(/"/gi, ''))
			return (await playerApi.getPlayer(params.room || '', JSON.parse(name))).data
		}
	} catch {
		return {}
	}
}
