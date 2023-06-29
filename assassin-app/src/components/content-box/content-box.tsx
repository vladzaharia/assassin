import { ReactNode } from 'react'
import './content-box.css'

export interface ContentBoxProps {
	children: ReactNode
}

function ContentBox({ children }: ContentBoxProps) {
	return (
		<div className="app">
			<div className="content-box">{children}</div>
		</div>
	)
}

export default ContentBox
