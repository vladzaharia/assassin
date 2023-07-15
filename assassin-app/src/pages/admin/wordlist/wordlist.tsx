import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChevronLeft, faTextSize, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { Wordlist as WordListResponse } from 'assassin-server-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { AddToLibrary } from '../../../components/icons/icons'
import useReload from '../../../hooks/reload'

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
				className="green corner-right"
				leftActions={<Button className="green" onClick={() => navigate(`/admin/wordlist`)} iconProps={{ icon: faChevronLeft }} />}
				rightActions={<Button className="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
		</div>
	)
}
