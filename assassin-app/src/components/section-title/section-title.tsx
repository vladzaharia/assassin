import './section-title.css'

export default function SectionTitle({
	className,
	children,
	...h3Props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
	return (
		<h3 className={`section-title ${className || ''}`} {...h3Props}>
			{children}
		</h3>
	)
}
