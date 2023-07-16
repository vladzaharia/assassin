/* eslint-disable react/jsx-no-useless-fragment */
import './word-card.css'
import { Card, CardContent } from '@mui/material'

interface WordProps {
	word: string
	disabled: boolean
	onClick?: () => void
}

function WordCard({ word, disabled, onClick }: WordProps) {
	return (
		<Card
			onClick={onClick}
			variant="elevation"
			elevation={3}
			sx={{
				border: '0.0625rem solid var(--border)',
				borderColor: disabled ? 'var(--disabled)' : onClick ? 'var(--green)' : 'var(--border)',
				color: onClick ? 'var(--green)' : 'var(--foreground)',
				transition: 'all 0.3s ease',
				width: '30%',
				backgroundColor: 'var(--background)',
			}}
		>
			<CardContent className={`word ${disabled ? 'disabled' : ''} ${onClick ? 'clickable' : ''}`} sx={{ padding: '1rem !important' }}>
				{word}
			</CardContent>
		</Card>
	)
}

export default function WordCards({ words, onWordClick }: { words?: string[]; onWordClick?: (word: string) => void }) {
	return (
		<div className="words">
			{words ? (
				words.map((w) => (
					<WordCard
						key={w}
						word={w}
						disabled={!onWordClick}
						onClick={
							onWordClick
								? () => {
										onWordClick(w)
								  }
								: undefined
						}
					/>
				))
			) : (
				<></>
			)}
		</div>
	)
}
