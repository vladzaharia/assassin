import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover as MUIPopover } from '@mui/material'
import './popover.css'
import { useContext } from 'react'
import { ContainerContext } from '../../context/container'

export type PopoverColor = 'primary' | 'blue' | 'green' | 'orange' | 'grey-dark'

export interface PopoverContentProps {
	title?: string
	description?: string | JSX.Element
	color: PopoverColor
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

export default function Popover(props: PopoverProps) {
	const { anchor, color, open, onClose } = props
	const containerContext = useContext(ContainerContext)

	return (
		<MUIPopover
			open={open}
			anchorEl={anchor}
			onClose={onClose}
			container={containerContext?.current}
			slotProps={{
				paper: {
					elevation: 0,
					sx: {
						marginTop: '0.5rem',
						border: `solid 1px var(--${color})`,
						borderRadius: '0.5rem',
						backgroundColor: 'var(--background)',
						color: 'var(--foreground)',
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
