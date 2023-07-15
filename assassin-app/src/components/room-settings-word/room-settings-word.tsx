import Action from '../action/action'
import WordLists from '../wordlists/wordlists'
import { faMessageMinus, faMessagePlus, faTextSize } from '@fortawesome/pro-solid-svg-icons'
import { createAdminOrGMApi } from '../../api'
import { NotificationContext } from '../../context/notification'
import { RoomContext } from '../../context/room'
import { useContext, useState } from 'react'
import { useRevalidator } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import { isAxiosError } from 'axios'
import './room-settings-word.css'
import { useAuth } from 'react-oidc-context'
import { RoomSettingsComponentProps } from '../../types'
import Toggle from '../toggle/toggle'
import SectionTitle from '../section-title/section-title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function RoomSettingsWordlist({ apiType }: RoomSettingsComponentProps) {
	const { revalidate } = useRevalidator()

	const auth = useAuth()
	const [name] = useLocalStorage('name', '')

	const api = createAdminOrGMApi(apiType, name, auth.user?.access_token || '')

	const { setError, setNotification } = useContext(NotificationContext)

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room
	const [usesWords, setUsesWords] = useState<boolean>(roomStatus?.usesWords || false)
	const [numWords, setNumWords] = useState<number>(roomStatus?.numWords || 0)

	const updateWordLists = async (name: string) => {
		if (roomStatus?.status !== 'started') {
			try {
				if (roomStatus?.wordLists?.includes(name)) {
					await api.patchRoom(roomStatus.name, {
						wordLists: roomStatus?.wordLists.filter((wl) => wl !== name),
					})
					setNotification({
						message: `Removed ${name} successfully!`,
						notificationType: 'success',
						source: 'wordlist',
						icon: faMessageMinus,
					})
				} else {
					await api.patchRoom(roomStatus?.name || '', {
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
					setError(e.response?.data?.message || e.message, 'wordlist')
				} else {
					setError('Something went wrong!', 'wordlist')
				}
			}
		}
	}

	const updateUsesWords = async () => {
		if (roomStatus?.status !== 'started') {
			try {
				const newValue = !roomContext?.room?.usesWords
				await api.patchRoom(roomContext?.room?.name || '', {
					usesWords: newValue,
				})
				setUsesWords(newValue)
				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data?.message || e.message, 'wordlist')
				} else {
					setError('Something went wrong!', 'wordlist')
				}
			}
		}
	}

	const updateNumWords = async (newValue: number) => {
		if (roomStatus?.status !== 'started') {
			try {
				await api.patchRoom(roomContext?.room?.name || '', {
					numWords: newValue,
				})
				setNumWords(newValue)
				revalidate()
			} catch (e) {
				if (isAxiosError(e)) {
					setError(e.response?.data?.message || e.message, 'wordlist')
				} else {
					setError('Something went wrong!', 'wordlist')
				}
			}
		}
	}

	const isPlaying = roomStatus?.status === 'started'

	return (
		<div className="wordlists-wrapper">
			<SectionTitle className="blue">
				<FontAwesomeIcon className="mr-05" icon={faTextSize} />
				Word settings
			</SectionTitle>
			<Action text="Use words?" description="Whether to use words for this room, or play standard assassin.">
				<Toggle
					disabled={isPlaying}
					checked={usesWords}
					onChange={() => updateUsesWords()}
					className={`toggle blue ${usesWords ? 'checked' : ''} ${isPlaying ? 'disabled' : ''}`}
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
						<WordLists onWordListClick={updateWordLists} />
					</Action>
				</>
			) : undefined}
		</div>
	)
}
