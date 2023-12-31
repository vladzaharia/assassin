/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Action from '../action/action'
import WordListCards from '../wordlist-card/wordlist-card'
import { faMessageMinus, faMessagePlus, faTextSize } from '@fortawesome/pro-solid-svg-icons'
import { createAdminOrGMApi } from '../../api'
import { useNotificationAwareRequest } from '../../hooks/notification'
import { RoomContext } from '../../hooks/room'
import { useContext, useState } from 'react'
import './room-settings-word.css'
import { useAuth } from 'react-oidc-context'
import { RoomSettingsComponentProps } from '../../types'
import Toggle from '../toggle/toggle'
import SectionTitle from '../section-title/section-title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NameContext } from '../../hooks/name'

export default function RoomSettingsWordlist({ apiType }: RoomSettingsComponentProps) {
	const request = useNotificationAwareRequest()
	const auth = useAuth()
	const { name } = useContext(NameContext)!

	const api = createAdminOrGMApi(apiType, name!, auth.user?.access_token || '')

	const roomContext = useContext(RoomContext)
	const roomStatus = roomContext?.room
	const [usesWords, setUsesWords] = useState<boolean>(roomStatus?.usesWords || false)
	const [numWords, setNumWords] = useState<number>(roomStatus?.numWords || 0)

	const updateWordLists = async (name: string) => {
		if (roomStatus?.status !== 'started') {
			if (roomStatus?.wordLists?.includes(name)) {
				await request(
					async () =>
						await api.patchRoom(roomStatus.name, {
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							wordLists: roomStatus.wordLists!.filter((wl) => wl !== name),
						}),
					{
						message: `Removed ${name} successfully!`,
						source: 'wordlist',
						icon: faMessageMinus,
					}
				)
			} else {
				await request(
					async () =>
						await api.patchRoom(roomStatus?.name || '', {
							wordLists: [...(roomStatus?.wordLists || []), name],
						}),
					{
						message: `Added ${name} successfully!`,
						source: 'wordlist',
						icon: faMessagePlus,
					}
				)
			}
		}
	}

	const updateUsesWords = async () => {
		if (roomStatus?.status !== 'started') {
			const newValue = !roomContext?.room?.usesWords

			await request(
				async () =>
					await api.patchRoom(roomContext?.room?.name || '', {
						usesWords: newValue,
					}),
				undefined,
				() => setUsesWords(newValue)
			)
		}
	}

	const updateNumWords = async (newValue: number) => {
		if (roomStatus?.status !== 'started') {
			await request(
				async () =>
					await api.patchRoom(roomContext?.room?.name || '', {
						numWords: newValue,
					}),
				undefined,
				() => setNumWords(newValue)
			)
		}
	}

	const isPlaying = roomStatus?.status === 'started'

	return (
		<div className="wordlists-wrapper">
			<SectionTitle color="blue">
				<FontAwesomeIcon className="mr-05" icon={faTextSize} />
				Word settings
			</SectionTitle>
			<Action text="Use words?" description="Whether to use words for this room, or play standard assassin.">
				<Toggle disabled={isPlaying} checked={usesWords} onChange={() => updateUsesWords()} color="blue" />
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
						<WordListCards onWordListClick={updateWordLists} />
					</Action>
				</>
			) : undefined}
		</div>
	)
}
