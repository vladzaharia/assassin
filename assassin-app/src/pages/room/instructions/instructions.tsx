import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/pro-regular-svg-icons'
import { faCheck, faCrosshairs, faRetweet, faTimer, faTrophyStar, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useEffect } from 'react'
import { RoomContext } from '../../../hooks/room'
import './instructions.css'
import { useNavigate } from 'react-router-dom'

interface StepProps {
	icon: IconDefinition
	color: string
	title: string
	description: string
}

function Step({ icon, color, title, description }: StepProps) {
	return (
		<div className="step">
			<div className="icon">
				<FontAwesomeIcon icon={icon} color={`var(--${color})`} size="2x" />
			</div>
			<div className="explanation">
				<h3>{title}</h3>
				<span>{description}</span>
			</div>
		</div>
	)
}

export default function Instructions() {
	const roomContext = useContext(RoomContext)
	const usesWords = roomContext?.room?.usesWords

	const navigate = useNavigate()

	useEffect(() => {
		const room = roomContext?.room

		if (room?.status === 'completed') {
			navigate(`/room/${room?.name}/complete`)
		}
	}, [roomContext?.room])

	return (
		<div className="instructions">
			<h2 className="title">How to Play</h2>
			<Step
				title="Join the game"
				description="Click the join button by the player list to join this room!"
				icon={faUserPlus}
				color="green"
			/>
			<Step
				title="Wait for the game to start..."
				description="Once enough players join, the game can start. Get your friends and coworkers to join you by sharing this room link."
				icon={faTimer}
				color="orange"
			/>
			<Step
				title="Retrieve your mission"
				description={
					usesWords
						? 'Once the game starts, retrieve your mission to find your target and words.'
						: 'Once the game starts, retrieve your mission to find your target.'
				}
				icon={faUserSecret}
				color="primary"
			/>
			<Step
				title="Eliminate your target!"
				description={
					usesWords ? 'Try to get your target to say one of your words to eliminate them!' : 'Tag your target to eliminate them!'
				}
				icon={faCrosshairs}
				color="primary-dark"
			/>
			<Step
				title="Record your assassination"
				description={
					usesWords
						? "Once you've eliminated your target, record which word you used here."
						: "Once you've eliminated your target, record your elimination here."
				}
				icon={faCheck}
				color="blue-dark"
			/>
			<Step
				title="Take your target's words and target"
				description={
					usesWords
						? "You'll be assigned your target's words and target. You can use any unused words to eliminate your new target!"
						: "You'll be assigned your target's target; eliminate them!"
				}
				icon={faRetweet}
				color="purple"
			/>
			<Step
				title="Become the champion!"
				description="Eliminate everyone else in the room and become the champion of the game!"
				icon={faTrophyStar}
				color="yellow"
			/>
		</div>
	)
}
