import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { IconName, faChevronLeft, faList, faPencil, faTextSize, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { Wordlist as WordListResponse } from 'assassin-server-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { AddToLibrary } from '../../../components/icons/icons'
import useReload from '../../../hooks/reload'
import SectionTitle from '../../../components/section-title/section-title'
import Action from '../../../components/action/action'
import Pill from '../../../components/pill/pill'
import { useState } from 'react'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'

export default function WordlistAdmin() {
	const wordlist = useLoaderData() as WordListResponse
	useReload(wordlist)
	const navigate = useNavigate()
	const request = useNotificationAwareRequest()
	const auth = useAuth()

	const [newWord, setNewWord] = useState<string>('')

	const api = createAdminApi(auth.user?.access_token || '')

	AddToLibrary()

	const addWord = async () => {
		await request(
			async () => await api.putWord(wordlist.name, newWord),
			{
				message: `${newWord} added to ${wordlist.name}`,
			},
			() => setNewWord('')
		)
	}

	const removeWord = async (word: string) => {
		await request(async () => await api.deleteWord(wordlist.name, word), {
			message: `${word} removed from ${wordlist.name}`,
		})
	}

	return (
		<div className="wordlist">
			<Header
				title={
					<>
						<FontAwesomeIcon className="mr-05" icon={(wordlist.icon as IconProp) || faTextSize} /> {wordlist.name}
					</>
				}
				color="green"
				className="corner-right"
				leftActions={<Button color="green" onClick={() => navigate(`/admin/wordlist`)} iconProps={{ icon: faChevronLeft }} />}
				rightActions={<Button color="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<SectionTitle color="green">
				<div className="section-title-with-action">
					<span>
						<FontAwesomeIcon className="mr-05" icon={faList} /> Details
					</span>
					<Button color="orange" iconProps={{ icon: faPencil }} />
				</div>
			</SectionTitle>
			<Action text="Description">
				<span>{wordlist.description}</span>
			</Action>
			<Action text="Icon">
				<span>
					<FontAwesomeIcon className="mr-05" icon={(wordlist.icon as IconName) || faTextSize} /> {wordlist.icon}
				</span>
			</Action>

			<SectionTitle color="green">
				<>
					<FontAwesomeIcon className="mr-05" icon={faTextSize} /> Words
				</>
			</SectionTitle>
			<Action text="Add word" description="Type a new word and press Enter, Space or comma (,)">
				<input
					type="text"
					value={newWord}
					onChange={(e) => setNewWord(e.currentTarget.value)}
					onKeyUp={(e) => {
						if ((e.key === 'Enter' || e.key === 'Space' || e.key === ',') && newWord !== '') {
							addWord()
						}
					}}
				/>
			</Action>
			<div className="wordlist-words">
				{wordlist.words.map((w) => (
					<Pill color="green" text={w} onDelete={() => removeWord(w)} />
				))}
			</div>
		</div>
	)
}
