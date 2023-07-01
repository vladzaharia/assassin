import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover as MUIPopover } from '@mui/material'

import './popover.css'

export interface PopoverContentProps {
	title?: string
	description?: string
	color: string
	icon?: IconDefinition
}

const PopoverContent = ({ title, description, color, icon }: PopoverContentProps) => {
	return (
		<div className="popover">
			{title && (
				<h3 className={color}>
					{icon && <FontAwesomeIcon icon={icon} size="lg" />}
					{title}
				</h3>
			)}
			{description && <span className="description">{description}</span>}
		</div>
	)
}

export interface PopoverProps extends PopoverContentProps {
	open: boolean
	anchor: HTMLElement | null
	onClose: () => void
}

const Popover = (props: PopoverProps) => {
	const { anchor, color, open, onClose } = props

	return (
		<MUIPopover
			open={open}
			anchorEl={anchor}
			onClose={onClose}
			slotProps={{
				paper: {
					elevation: 0,
					sx: {
						'margin-top': '0.5rem',
						border: `solid 1px var(--${color})`,
						'border-radius': '0.5rem',
					},
				},
			}}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			sx={{
				pointerEvents: 'none',
			}}
			disableRestoreFocus
			hideBackdrop
		>
			<PopoverContent {...props} />
		</MUIPopover>
	)
}

export default Popover
