import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/pro-regular-svg-icons'
import isMobile from 'is-mobile'
import { useRef, useState } from 'react'
import Popover from '../popover/popover'
import './status.css'
import { Color } from '../../types'

export interface StatusProps {
	color: Color
	popover?: {
		title: string
		description: string | JSX.Element
	}
	icon: IconDefinition
}

export default function Status({ color, popover, icon }: StatusProps) {
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const popoverAnchor = useRef<any>(null)

	return (
		<>
			<div
				ref={popoverAnchor}
				className={`status-marker ${color}`}
				onPointerEnter={() => {
					if (popover && !isMobile()) {
						setPopoverOpen(true)
					}
				}}
				onPointerLeave={() => {
					if (popover && !isMobile()) {
						setPopoverOpen(false)
					}
				}}
				onClick={() => {
					if (popover && isMobile()) {
						setPopoverOpen(!popoverOpen)
					}
				}}
			>
				<FontAwesomeIcon icon={icon} />
			</div>
			{popover && (
				<Popover
					open={popoverOpen}
					anchor={popoverAnchor.current}
					color={color}
					title={popover.title}
					description={popover.description}
					icon={icon}
					onClose={() => setPopoverOpen(false)}
				/>
			)}
		</>
	)
}
