import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlists.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faTextSize, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function WordlistsAdmin() {
	const wordlists = useLoaderData() as string[]
	const navigate = useNavigate()

	return (
		<div className="wordlist-list">
			<Header
				title="Word lists"
				className="blue corner-right"
				leftActions={<FontAwesomeIcon icon={faTextSize} size="lg" />}
				rightActions={<Button className="blue" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
		</div>
	)
}
