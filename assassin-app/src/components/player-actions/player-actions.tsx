import { IconDefinition } from '@fortawesome/pro-regular-svg-icons'
import { faCrown, faUserSecret } from '@fortawesome/pro-solid-svg-icons'
import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { RoomContext } from '../../context/room'
import Button, { ButtonProps } from '../button/button'
import './player-actions.css'

interface PlayerActionProps extends ButtonProps {
	icon: IconDefinition
	destination: string
}

function PlayerAction({ text, icon, className, destination, ...buttonProps }: PlayerActionProps) {
	const navigate = useNavigate()
	const location = useLocation()

	return (
		<div
			className={`player-action clickable ${className || ''}`}
			onClick={() => {
				if (!location.pathname.includes(destination)) {
					navigate(destination)
				} else {
					navigate('..', { relative: 'path' })
				}
			}}
		>
			<Button
				className={className}
				iconProps={{
					icon: icon,
				}}
				{...buttonProps}
			/>
			<span className="text">{text}</span>
		</div>
	)
}

export default function PlayerActions() {
	const [name] = useLocalStorage('name', '')
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
					<PlayerAction key="mission" className="primary" text="Mission" icon={faUserSecret} destination="mission" />
				)
			) : undefined}
			{isGM ? <PlayerAction key="gm" className="blue" text="GM Settings" icon={faCrown} destination="settings" /> : undefined}
		</div>
	) : null
}
