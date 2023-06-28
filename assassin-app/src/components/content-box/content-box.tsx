import { ReactNode } from 'react'
import './content-box.css'

export interface ContentBoxProps {
	children: ReactNode
}

function ContentBox({ children }: ContentBoxProps) {
	return (
		<div className="app">
			<h1>Word Assassin</h1>
			<div className="content-box">{children}</div>
		</div>
	)
}

export default ContentBox
