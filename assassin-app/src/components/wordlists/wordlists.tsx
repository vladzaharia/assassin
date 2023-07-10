import { useContext, useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import { RoomContext } from '../../context/room'
import './wordlists.css'
import { createGMApi, createWordlistApi } from '../../api'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { NotificationContext } from '../../context/notification'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Wordlist } from 'assassin-server-client'
import { faMessageText } from '@fortawesome/pro-solid-svg-icons'
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
	return (
		<Card
			onClick={onClick}
			variant="outlined"
			sx={{
				borderColor: selected ? 'var(--green)' : disabled ? 'var(--grey-dark)' : 'var(--border)',
				transition: 'all 0.3s ease',
			}}
		>
			<CardContent className={`wordlist ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`} sx={{ padding: '0' }}>
				<div className="title">
					<FontAwesomeIcon icon={icon || faMessageText} size="lg" />
					<span className="name">{name}</span>
				</div>
				<span className="description">{description}</span>
				<span className="words">
					<em>{words.length} words</em>
				</span>
			</CardContent>
		</Card>
	)
}

export default function WordLists() {
	const navigate = useNavigate()
	const [name] = useLocalStorage('name', '')
	const gmApi = createGMApi(name)

	const wordlistApi = createWordlistApi()
	const [wordLists, setWordLists] = useState<Wordlist[]>([])

	const notificationContext = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room
	const isPlaying = roomStatus?.status === 'started'

	const getWordLists = async () => {
		try {
			const allWordLists = (await wordlistApi.listWordList()).data.wordlists

			const wordLists: Wordlist[] = []
			for (const listName of allWordLists || []) {
				wordLists.push((await wordlistApi.getWordList(listName)).data)
			}

			setWordLists(wordLists)
		} catch (e) {
			if (isAxiosError(e)) {
				notificationContext.setError(e.response?.data || e.message, 'gm-reset')
			} else {
				notificationContext.setError('Failed to fetch wordlists!', 'gm-reset')
			}
		}
	}

	const setWordListsAsync = async (name: string) => {
		try {
			if (roomStatus?.wordLists?.includes(name)) {
				await gmApi.patchRoom(roomStatus.name, {
					wordLists: roomStatus?.wordLists.filter((wl) => wl !== name),
				})
				notificationContext.setNotification({ message: `Removed ${name} successfully!`, notificationType: 'success', source: 'wordlist' })
			} else {
				await gmApi.patchRoom(roomStatus?.name || '', {
					wordLists: [...(roomStatus?.wordLists || []), name],
				})
				notificationContext.setNotification({ message: `Added ${name} successfully!`, notificationType: 'success', source: 'wordlist' })
			}

			navigate('.', { relative: 'path' })
		} catch (e) {
			if (isAxiosError(e)) {
				notificationContext.setError(e.response?.data || e.message, 'gm-reset')
			} else {
				notificationContext.setError('Something went wrong!', 'gm-reset')
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
					disabled={isPlaying || !roomStatus?.usesWords}
					selected={roomStatus?.wordLists?.includes(wl.name) || false}
					onClick={() => setWordListsAsync(wl.name)}
				/>
			))}
		</div>
	)
}
