import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import './button.css'

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	className?: string
	text?: string
	iconProps?: FontAwesomeIconProps
	onClick?: () => void
}

export default function Button({ className, disabled, text, iconProps, onClick, ...buttonProps }: ButtonProps) {
	return (
		<button
			{...buttonProps}
			className={`button ${className || ''}`}
			disabled={disabled}
			onClick={
				onClick ||
				(() => {
					return
				})
			}
		>
			{iconProps && <FontAwesomeIcon {...iconProps} />}
			{text && <span>{text}</span>}
		</button>
	)
}
