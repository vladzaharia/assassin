import { CommonColor } from '../../types'
import './section-title.css'

export interface SectionTitleProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
	color: CommonColor
}

export default function SectionTitle({ color, className, children, ...h3Props }: SectionTitleProps) {
	return (
		<h3 className={`section-title ${color} ${className || ''}`} {...h3Props}>
			{children}
		</h3>
	)
}
