import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrosshairs, faHourglass, faMagnifyingGlass, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { faCardsBlank } from '@fortawesome/pro-regular-svg-icons'

import './introduction.css'

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

function Introduction() {
	return (
		<div className="introduction">
			<h2 className="title">How to Play</h2>
			<Step
				title='Join the game'
				description='Enter your first name and click "Join" to add your name to the list.'
				icon={faUserPlus}
				color='blue' />
			<Step
				title='Wait for the game to start...'
				description='Once enough players join, the game can start. Until then, study your first card and the words on it.'
				icon={faHourglass}
				color='orange' />
			<Step
				title='Look up your target'
				description='Enter your first name and click "Lookup" to find who your target is.'
				icon={faMagnifyingGlass}
				color='green' />
			<Step
				title='Eliminate your target!'
				description='Try to get your target to say one of your words through the day.'
				icon={faCrosshairs}
				color='primary' />
			<Step
				title='Record your assassination'
				description="Once you've assassinated your target, rceord which word you used here."
				icon={faMagnifyingGlass}
				color='primary' />
			<Step
				title="Take your target's words and target"
				description="You'll be assigned your target's words and target. You can use any unused words to eliminate your new target!"
				icon={faCardsBlank}
				color='green' />
		</div>
	)
}

export default Introduction
