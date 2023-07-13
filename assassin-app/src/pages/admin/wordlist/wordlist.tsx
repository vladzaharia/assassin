import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChevronLeft, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { Wordlist as WordListResponse } from 'assassin-server-client'

export default function WordlistAdmin() {
	const wordlist = useLoaderData() as WordListResponse
	const navigate = useNavigate()

	return (
		<div className="wordlist">
			<Header
				title={wordlist.name}
				className="blue corner-right"
				leftActions={<Button className="blue" onClick={() => navigate(`/admin/wordlist`)} iconProps={{ icon: faChevronLeft }} />}
				rightActions={<Button className="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
		</div>
	)
}
