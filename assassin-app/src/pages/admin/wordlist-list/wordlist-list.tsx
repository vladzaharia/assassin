import { useLoaderData, useNavigate } from 'react-router-dom'
import './wordlist-list.css'
import Header from '../../../components/header/header'
import Button from '../../../components/button/button'
import { faEdit, faPlus, faTextSize, faTrash, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicWordlist } from 'assassin-server-client'
import Table from '../../../components/table/table'
import room from '../room/room'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { AddToLibrary } from '../../../components/icons/icons'

export default function WordlistsAdmin() {
	const wordlists = useLoaderData() as BasicWordlist[]
	const navigate = useNavigate()

	AddToLibrary()

	return (
		<div className="list wordlist-list">
			<Header
				title="Word lists"
				className="green corner-right"
				leftActions={<FontAwesomeIcon icon={faTextSize} size="lg" />}
				rightActions={<Button className="green" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Table
				className="green"
				headers={[
					{ element: 'Word list name' },
					{ element: '# words' },
					{
						element: (
							<div className="buttons">
								<Button className="green" iconProps={{ icon: faPlus }} />
							</div>
						),
					},
				]}
				rows={wordlists.map((list) => {
					return {
						name: room.name,
						cells: [
							{
								element: (
									<>
										<FontAwesomeIcon className="mr-05" icon={(list.icon as IconProp) || faTextSize} /> {list.name}
									</>
								),
							},
							{ element: list.numWords.toString() },
							{
								element: (
									<div className="buttons">
										<Button className="orange" iconProps={{ icon: faEdit }} onClick={() => navigate(list.name)} />{' '}
										<Button
											className="primary"
											iconProps={{ icon: faTrash }}
											onClick={(e) => {
												e.stopPropagation()
												e.preventDefault()
											}}
										/>
									</div>
								),
							},
						],
						onClick: () => navigate(list.name),
					}
				})}
			/>
		</div>
	)
}
