import { Switch, SwitchProps } from '@mui/material'
import './toggle.css'
import { CommonColor } from '../../types'

export interface ToggleProps extends Omit<SwitchProps, 'color'> {
	color: CommonColor
}

export default function Toggle({ color, className, ...props }: ToggleProps) {
	return (
		<Switch
			className={`toggle ${color || ''} ${className || ''} ${props.checked ? 'checked' : ''} ${props.disabled ? 'disabled' : ''}`}
			{...props}
		/>
	)
}
