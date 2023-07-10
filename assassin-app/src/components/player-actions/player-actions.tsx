import { IconDefinition, faUserSecret } from '@fortawesome/pro-regular-svg-icons'
import { faCog } from '@fortawesome/pro-solid-svg-icons'
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
		<div className="action">
			<span className="text">{text}</span>
			<Button
				className={className}
				iconProps={{
					icon: icon,
				}}
				onClick={() => {
					if (!location.pathname.includes(destination)) {
						navigate(destination)
					} else {
						navigate('..', { relative: 'path' })
					}
				}}
				{...buttonProps}
			/>
		</div>
	)
}

export default function PlayerActions() {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomContext)

	const roomStatus = roomContext?.room

	const isPlaying = roomStatus?.status === 'started' && roomStatus?.players.some((p) => p.name === name)
	const isGM = roomContext?.playerIsGM

	return isPlaying || isGM ? (
		<div className="player-actions">
			{isPlaying ? (
				<PlayerAction
					key="mission"
					className="primary"
					text="Retrieve mission"
					icon={faUserSecret}
					destination="mission"
					popoverProps={{
						title: 'Retrieve Mission',
						description: (
							<>
								<strong>The game has started!</strong> <br />
								<br />
								Click here to retrieve your mission and play the game!
							</>
						),
						color: 'primary',
						icon: faCog,
					}}
				/>
			) : undefined}
			{isGM ? (
				<PlayerAction
					key="gm"
					className="blue"
					text="Room settings"
					icon={faCog}
					destination="settings"
					popoverProps={{
						title: 'Room Settings',
						description: (
							<>
								Congratulations, you are the GM! <br />
								<br /> <strong>Click here to set room settings and start the game.</strong>
							</>
						),
						color: 'blue',
						icon: faCog,
					}}
				/>
			) : undefined}
		</div>
	) : null
}
