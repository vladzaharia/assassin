import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faChartLineUp, faChevronLeft, faCircleHalfStroke, faComputerClassic, faDagger, faEarthAmericas, faFlag, faFlask, faFlaskRoundPoison, faPlanetRinged, faStars, faTextSize, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { Wordlist as WordListResponse } from 'assassin-server-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp, library } from '@fortawesome/fontawesome-svg-core'

export default function WordlistAdmin() {
	const wordlist = useLoaderData() as WordListResponse
	const navigate = useNavigate()

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
		<div className="wordlist">
			<Header
				title={<><FontAwesomeIcon className='mr-05' icon={wordlist.icon as IconProp || faTextSize} /> {wordlist.name}</>}
				className="green corner-right"
				leftActions={<Button className="green" onClick={() => navigate(`/admin/wordlist`)} iconProps={{ icon: faChevronLeft }} />}
				rightActions={<Button className="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
		</div>
	)
}
