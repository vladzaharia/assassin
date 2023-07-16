import { faList, faCheck, IconName, faTextSize, faPlus } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Action from '../action/action'
import SectionTitle from '../section-title/section-title'
import Button from '../button/button'
import { useLoaderData } from 'react-router-dom'
import { Wordlist as WordListResponse } from 'assassin-server-client'
import { useState } from 'react'
import { AVAILABLE_ICONS, AddToLibrary } from '../icons/icons'
import { useNotificationAwareRequest } from '../../hooks/notification'
import { createAdminApi } from '../../api'
import { useAuth } from 'react-oidc-context'
import Pill from '../pill/pill'
import { faXmark } from '@fortawesome/pro-solid-svg-icons'

export default function WordlistDetails({ inModal, onClose }: { inModal?: boolean; onClose?: () => void }) {
	const wordlist = useLoaderData() as WordListResponse
	const request = useNotificationAwareRequest()
	const auth = useAuth()

	const api = createAdminApi(auth.user?.access_token || '')

	const [name, setName] = useState<string>(wordlist?.name)
	const [description, setDescription] = useState<string>(wordlist?.description)
	const [icon, setIcon] = useState<string | null | undefined>(wordlist?.icon)

	const isManaged = wordlist.managed

	AddToLibrary()

	const addWordList = async () => {
		if (name !== '' && description !== '') {
			await request(
				async () =>
					await api.putWordList(name, {
						description,
						icon: icon as string | undefined,
					}),
				{
					message: `${name} updated successfully!`,
					source: 'wordlist',
				},
				() => onClose && onClose()
			)
		}
	}

	const updateDetails = async () => {
		await request(
			async () =>
				await api.patchWordList(wordlist.name, {
					description,
					icon: icon as string | undefined,
				}),
			{
				message: `${wordlist.name} updated successfully!`,
				source: 'wordlist',
			}
		)
	}

	const IconSelector = () => {
		return (
			<div className="icons">
				{AVAILABLE_ICONS.map((i) => (
					<Pill
						color="green"
						className={i.iconName === icon ? 'active' : undefined}
						text={<FontAwesomeIcon icon={i} />}
						onClick={() => setIcon(i.iconName === icon ? null : i.iconName)}
					/>
				))}
			</div>
		)
	}

	return (
		<>
			{!inModal ? (
				<SectionTitle color={'green'}>
					{isManaged ? (
						<>
							<FontAwesomeIcon className="mr-05" icon={faList} /> Details
						</>
					) : (
						<div className="section-title-with-action">
							<span>
								<FontAwesomeIcon className="mr-05" icon={faList} /> Details
							</span>
							<Button
								color="green"
								iconProps={{ icon: faCheck }}
								disabled={description === wordlist.description && icon === wordlist.icon}
								onClick={() => updateDetails()}
							/>
						</div>
					)}
				</SectionTitle>
			) : undefined}
			{inModal ? (
				<Action text="Word list name" description="Name of the word list to create. Must be unique">
					<input className="green" type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} />
				</Action>
			) : undefined}
			{!inModal && isManaged ? (
				<Action text="Managed?" description="This word list is managed; its settings cannot be updated.">
					<FontAwesomeIcon className="mr-1" icon={isManaged ? faCheck : faXmark} />
				</Action>
			) : undefined}
			{!isManaged ? (
				<>
					<Action className="column" text="Description">
						<textarea className="green" value={description} onChange={(e) => setDescription(e.currentTarget.value)} />
					</Action>
					<Action
						className="column"
						text="Icon"
						description={
							!inModal ? (
								<span className="mr-05">
									<FontAwesomeIcon className="mr-05" icon={(icon as IconName) || faTextSize} /> {icon || '(default icon)'}
								</span>
							) : undefined
						}
					>
						<IconSelector />
					</Action>
					{inModal ? (
						<Action>
							<Button color="green" iconProps={{ icon: faPlus }} text="Create" onClick={() => addWordList()} />
						</Action>
					) : undefined}
				</>
			) : undefined}
		</>
	)
}
