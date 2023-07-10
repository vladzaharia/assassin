import { useContext, useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import { RoomContext } from '../../context/room'
import './wordlists.css'
import { createGMApi, createWordlistApi } from '../../api'
import { useRevalidator } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { NotificationContext } from '../../context/notification'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Wordlist } from 'assassin-server-client'
import { faMessageMinus, faMessagePlus, faMessageText } from '@fortawesome/pro-solid-svg-icons'
import { Card, CardContent, Switch } from '@mui/material'
import GMAction from '../gm-action/gm-action'

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
			variant="elevation"
			elevation={3}
			sx={{
				border: '0.0625rem solid var(--border)',
				borderColor: disabled ? 'var(--disabled)' : selected ? 'var(--green)' : 'var(--border)',
				transition: 'all 0.3s ease',
			}}
		>
			<CardContent className={`wordlist ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`} sx={{ padding: '0' }}>
				<div className="title">
					<FontAwesomeIcon icon={icon || faMessageText} size="lg" />
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

export default function WordLists() {
	const { revalidate } = useRevalidator()
	const [name] = useLocalStorage('name', '')
	const gmApi = createGMApi(name)

	const wordlistApi = createWordlistApi()
	const [wordLists, setWordLists] = useState<Wordlist[]>([])

	const { setError, setNotification } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room
	const isPlaying = roomStatus?.status === 'started'
	const [usesWords, setUsesWords] = useState<boolean>(roomStatus?.usesWords || false)

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
				setError(e.response?.data?.message || e.response?.data || e.message, 'gm-reset')
			} else {
				setError('Failed to fetch wordlists!', 'gm-reset')
			}
		}
	}

	const updateWordLists = async (name: string) => {
		try {
			if (roomStatus?.wordLists?.includes(name)) {
				await gmApi.patchRoom(roomStatus.name, {
					wordLists: roomStatus?.wordLists.filter((wl) => wl !== name),
				})
				setNotification({
					message: `Removed ${name} successfully!`,
					notificationType: 'success',
					source: 'wordlist',
					icon: faMessageMinus,
				})
			} else {
				await gmApi.patchRoom(roomStatus?.name || '', {
					wordLists: [...(roomStatus?.wordLists || []), name],
				})
				setNotification({
					message: `Added ${name} successfully!`,
					notificationType: 'success',
					source: 'wordlist',
					icon: faMessagePlus,
				})
			}

			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data || e.message, 'gm-reset')
			} else {
				setError('Something went wrong!', 'gm-reset')
			}
		}
	}

	const updateUsesWords = async () => {
		try {
			const newValue = !roomContext?.room?.usesWords
			await gmApi.patchRoom(roomContext?.room?.name || '', {
				usesWords: newValue,
			})
			setUsesWords(newValue)
			revalidate()
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data || e.message, 'wordlist')
			} else {
				setError('Something went wrong!', 'wordlist')
			}
		}
	}

	useEffect(() => {
		getWordLists()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="wordlists-wrapper">
			<h3>Word list settings</h3>
			<GMAction text="Use word lists?" description="Whether to use word lists for this room, or play standard assassin.">
				<Switch
					disabled={isPlaying}
					checked={usesWords}
					onChange={() => updateUsesWords()}
					className={`toggle primary ${usesWords ? 'checked' : ''} ${isPlaying ? 'disabled' : ''}`}
				/>
			</GMAction>
			{roomStatus?.usesWords ? (
				<GMAction text="Word lists" className="wordlists">
					<div className="wordlists">
						{wordLists.map((wl) => (
							<WordList
								{...(wl as WordListProps)}
								key={wl.name}
								disabled={isPlaying || !roomStatus?.usesWords}
								selected={roomStatus?.wordLists?.includes(wl.name) || false}
								onClick={() => updateWordLists(wl.name)}
							/>
						))}
					</div>
				</GMAction>
			) : undefined}
		</div>
	)
}
