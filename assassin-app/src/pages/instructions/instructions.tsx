import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faCrosshairs, faRetweet, faTimer, faTrophyStar, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './instructions.css'
import { faUserSecret } from '@fortawesome/pro-regular-svg-icons'

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
	return (
		<div className="instructions">
			<h2 className="title">How to Play</h2>
			<Step
				title="Join the game"
				description='Enter your first name and click "Join" to add your name to the list.'
				icon={faUserPlus}
				color="green"
			/>
			<Step
				title="Wait for the game to start..."
				description="Once enough players join, the game can start. Until then, study your first card and the words on it."
				icon={faTimer}
				color="orange"
			/>
			<Step
				title="Retrieve your mission"
				description="Once the game starts, you can look up who your target is by clicking the button in the menu."
				icon={faUserSecret}
				color="primary"
			/>
			<Step
				title="Eliminate your target!"
				description="Try to get your target to say one of your words through the day."
				icon={faCrosshairs}
				color="primary-dark"
			/>
			<Step
				title="Record your assassination"
				description="Once you've assassinated your target, rceord which word you used here."
				icon={faCheck}
				color="blue-dark"
			/>
			<Step
				title="Take your target's words and target"
				description="You'll be assigned your target's words and target. You can use any unused words to eliminate your new target!"
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