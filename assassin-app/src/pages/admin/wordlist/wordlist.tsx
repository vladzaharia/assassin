import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChevronLeft, faTextSize, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { Wordlist as WordListResponse } from 'assassin-server-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import useReload from '../../../hooks/reload'
import SectionTitle from '../../../components/section-title/section-title'
import Action from '../../../components/action/action'
import Pill from '../../../components/pill/pill'
import { useState } from 'react'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import WordlistDetails from '../../../components/wordlist-details/wordlist-details'

export default function WordlistAdmin() {
	const wordlist = useLoaderData() as WordListResponse
	useReload(wordlist)
	const navigate = useNavigate()
	const request = useNotificationAwareRequest()
	const auth = useAuth()

	const [newWord, setNewWord] = useState<string>('')

	const api = createAdminApi(auth.user?.access_token || '')

	const isManaged = wordlist.managed

	const addWord = async () => {
		await request(
			async () => await api.putWord(wordlist.name, newWord.replace(',', '')),
			{
				message: `${newWord.replace(',', '')} added to ${wordlist.name} successfully!`,
			},
			() => setNewWord('')
		)
	}

	const removeWord = async (word: string) => {
		await request(async () => await api.deleteWord(wordlist.name, word), {
			message: `${word} removed from ${wordlist.name} successfully!`,
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
			<WordlistDetails />
			<SectionTitle color="green">
				<>
					<FontAwesomeIcon className="mr-05" icon={faTextSize} /> Words
				</>
			</SectionTitle>
			{!isManaged ? (
				<Action text="Add word" description="Type a new word and press Enter or comma (,) to add it.">
					<input
						className="green"
						type="text"
						value={newWord}
						onChange={(e) => setNewWord(e.currentTarget.value)}
						onKeyUp={(e) => {
							if ((e.key === 'Enter' || e.key === ',') && newWord !== '') {
								addWord()
							}
						}}
					/>
				</Action>
			) : undefined}
			<div className="wordlist-words">
				{wordlist.words.map((w) => (
					<Pill color="green" text={w} onAction={!isManaged ? () => removeWord(w) : undefined} />
				))}
			</div>
		</div>
	)
}
