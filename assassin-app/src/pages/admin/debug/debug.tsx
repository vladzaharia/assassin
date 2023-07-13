import { useNavigate } from 'react-router-dom'
import './debug.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faCog, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function AdminDebug() {
	const navigate = useNavigate()

	return (
		<div className="room">
			<Header
				title={'Debug'}
				className="purple corner-right"
				leftActions={<FontAwesomeIcon icon={faCog} size="lg" />}
				rightActions={<Button className="purple" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
		</div>
	)
}
