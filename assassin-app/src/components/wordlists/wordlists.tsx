/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import { RoomContext } from '../../context/room'
import './wordlists.css'
import { createGMApi, createWordlistApi } from '../../api'
import { useRevalidator } from 'react-router-dom'
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
	faMessageMinus,
	faMessagePlus,
	faMessageText,
	faPlanetRinged,
	faStars,
} from '@fortawesome/pro-solid-svg-icons'
import { Card, CardContent, Switch } from '@mui/material'
import Action from '../action/action'

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
	const [numWords, setNumWords] = useState<number>(roomStatus?.numWords || 0)

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
		if (roomStatus?.status !== 'started') {
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
	}

	const updateUsesWords = async () => {
		if (roomStatus?.status !== 'started') {
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
	}

	const updateNumWords = async (newValue: number) => {
		if (roomStatus?.status !== 'started') {
			try {
				await gmApi.patchRoom(roomContext?.room?.name || '', {
					numWords: newValue,
				})
				setNumWords(newValue)
				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data || e.message, 'wordlist')
				} else {
					setError('Something went wrong!', 'wordlist')
				}
			}
		}
	}

	useEffect(() => {
		getWordLists()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="wordlists-wrapper">
			<h3>Word settings</h3>
			<Action text="Use words?" description="Whether to use words for this room, or play standard assassin.">
				<Switch
					disabled={isPlaying}
					checked={usesWords}
					onChange={() => updateUsesWords()}
					className={`toggle primary ${usesWords ? 'checked' : ''} ${isPlaying ? 'disabled' : ''}`}
				/>
			</Action>
			{roomStatus?.usesWords ? (
				<>
					<Action text="Number of words" description="Number of words to assign to each player on game start." className="num-words">
						<div className="input">
							<input
								type="number"
								name="numWords"
								max={10}
								min={1}
								value={numWords}
								onInput={(e) => updateNumWords(parseInt(e.currentTarget.value, 10))}
							/>
						</div>
					</Action>
					<Action text="Word lists" className="column">
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
					</Action>
				</>
			) : undefined}
		</div>
	)
}
