import { faCrown, faUserSecret } from '@fortawesome/pro-solid-svg-icons'
import { useContext } from 'react'
import { RoomContext } from '../../hooks/room'
import './player-actions.css'
import { MenuItem } from '../menu-item/menu-item'
import { NameContext } from '../..//hooks/name'

export default function PlayerActions() {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const { name } = useContext(NameContext)!
	const roomContext = useContext(RoomContext)

	const roomStatus = roomContext?.room

	const isPlaying = roomStatus?.status === 'started' && roomStatus?.players.some((p) => p.name === name)
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const player = roomStatus!.players.filter((p) => p.name === name)
	const isGM = roomContext?.playerIsGM

	return isPlaying || isGM ? (
		<div className="player-actions">
			{isPlaying ? (
				player.length > 0 && player[0].status === 'eliminated' ? (
					<div className="eliminated">
						<span className="title">You have been eliminated!</span>
						<span className="description">Wait until the game ends to play again.</span>
					</div>
				) : (
					<MenuItem key="mission" color="primary" text="Mission" icon={faUserSecret} destination="mission" />
				)
			) : undefined}
			{isGM ? <MenuItem key="gm" color="blue" text="GM Settings" icon={faCrown} destination="settings" /> : undefined}
		</div>
	) : null
}
