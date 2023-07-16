import { CommonColor } from '../../types'

export interface ChipProps {
	text: string
	color?: CommonColor
	className?: string
	onDelete?: (text: string) => void
}
