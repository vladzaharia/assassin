/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react'
import { RoomContext } from '../../context/room'
import './wordlists.css'
import { createWordlistApi } from '../../api'
import { isAxiosError } from 'axios'
import { NotificationContext } from '../../context/notification'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp, library } from '@fortawesome/fontawesome-svg-core'
import { Wordlist } from 'assassin-server-client'
import {
	faChartLineUp,
	faCircleHalfStroke,
	faComputerClassic,
	faDagger,
	faEarthAmericas,
	faFlag,
	faFlask,
	faFlaskRoundPoison,
	faMessageText,
	faPlanetRinged,
	faStars,
} from '@fortawesome/pro-solid-svg-icons'
import { Card, CardContent } from '@mui/material'

interface WordListProps {
	name: string
	description: string
	icon: IconProp
	words: string[]
	selected: boolean
	disabled: boolean
	onClick: () => void
}

function WordList({ name, description, icon, words, selected, disabled, onClick }: WordListProps) {
	library.add(
		faFlask,
		faFlaskRoundPoison,
		faPlanetRinged,
		faCircleHalfStroke,
		faDagger,
		faChartLineUp,
		faComputerClassic,
		faStars,
		faFlag,
		faEarthAmericas
	)

	return (
		<Card
			onClick={onClick}
			variant="elevation"
			elevation={3}
			sx={{
				border: '0.0625rem solid var(--border)',
				borderColor: selected ? 'var(--green)' : disabled ? 'var(--disabled)' : 'var(--border)',
				transition: 'all 0.3s ease',
				width: '30%',
				backgroundColor: 'var(--background)',
				color: 'var(--foreground)',
			}}
		>
			<CardContent className={`wordlist ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`} sx={{ padding: '0' }}>
				<div className="title">
					<div className="icon">
						<FontAwesomeIcon icon={icon || faMessageText} rotation={icon === 'circle-half-stroke' ? 90 : (0 as any)} size="lg" />
					</div>
					<span className="name">{name}</span>
				</div>
				<div className="additional">
					<span className="description">{description}</span>
					<span className="words">
						<em>{words.length} words</em>
					</span>
				</div>
			</CardContent>
		</Card>
	)
}

export default function WordLists({ onWordListClick }: { onWordListClick: (name: string) => void }) {
	const { setError } = useContext(NotificationContext)
	const wordlistApi = createWordlistApi()
	const [wordLists, setWordLists] = useState<Wordlist[]>([])

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room
	const isPlaying = roomStatus?.status === 'started'

	const getWordLists = async () => {
		try {
			const allWordLists = (await wordlistApi.listWordList()).data.wordLists

			const wordLists: Wordlist[] = []
			for (const listName of allWordLists || []) {
				wordLists.push((await wordlistApi.getWordList(listName)).data)
			}

			setWordLists(wordLists)
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data?.message || e.response?.data || e.message, 'gm-reset')
			} else {
				setError('Failed to fetch wordlists!', 'gm-reset')
			}
		}
	}

	useEffect(() => {
		getWordLists()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="wordlists">
			{wordLists.map((wl) => (
				<WordList
					{...(wl as WordListProps)}
					key={wl.name}
					disabled={isPlaying || !roomStatus?.usesWords}
					selected={roomStatus?.wordLists?.includes(wl.name) || false}
					onClick={() => onWordListClick(wl.name)}
				/>
			))}
		</div>
	)
}
