import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover as MUIPopover, PopoverProps as MUIPopoverProps } from '@mui/material'
import './popover.css'
import { useContext } from 'react'
import { ContainerContext } from '../../hooks/container'
import { CommonColor } from '../../types'

export interface PopoverContentProps {
	title?: string
	description?: string | JSX.Element
	color: CommonColor
	icon?: IconDefinition
}

const PopoverContent = ({ title, description, color, icon }: PopoverContentProps) => {
	return (
		<div className="popover">
			{title && (
				<h3 className={color}>
					{icon && <FontAwesomeIcon className="mr-1" icon={icon} size="lg" />}
					{title}
				</h3>
			)}
			{description && <div className="description">{description}</div>}
		</div>
	)
}

export interface PopoverProps extends PopoverContentProps, Omit<MUIPopoverProps, 'color'> {
	open: boolean
	anchor: HTMLElement | null
	onClose: () => void
}

export default function Popover(props: PopoverProps) {
	const { anchor, color, open, onClose } = props
	const containerContext = useContext(ContainerContext)

	return (
		<MUIPopover
			{...props}
			open={open}
			anchorEl={anchor}
			onClose={onClose}
			container={containerContext?.current}
			slotProps={
				props.slotProps || {
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
				}
			}
			anchorOrigin={
				props.anchorOrigin || {
					vertical: 'bottom',
					horizontal: 'center',
				}
			}
			transformOrigin={
				props.transformOrigin || {
					vertical: 'top',
					horizontal: 'center',
				}
			}
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
