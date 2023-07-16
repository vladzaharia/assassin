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
import { Chip } from '@mui/material'

export default function WordlistAdmin() {
	const wordlist = useLoaderData() as WordListResponse
	useReload(wordlist)
	const navigate = useNavigate()

	AddToLibrary()

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
			<div className="words">
				{wordlist.words.map((w) => (
					<Chip
						label={w}
						onDelete={() => {
							return
						}}
					/>
				))}
			</div>
		</div>
	)
}
