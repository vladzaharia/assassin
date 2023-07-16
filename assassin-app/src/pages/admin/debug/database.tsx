import { useNavigate } from 'react-router-dom'
import './database.css'
import Header from '../../../components/header/header'
import Button, { NotificationAwareButton } from '../../../components/button/button'
import { faDatabase, faFire, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Action from '../../../components/action/action'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import { useState } from 'react'
import { ConfirmModal } from '../../../components/modal/modal'

export default function AdminDatabase() {
	const request = useNotificationAwareRequest()
	const navigate = useNavigate()
	const auth = useAuth()
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

	const api = createAdminApi(auth.user?.access_token || '')

	const debugReset = async () => {
		await request(
			async () => await api.resetDatabase(),
			{
				message: `Database reset successfully!`,
				source: 'debug-reset',
				icon: faFire,
			},
			() => setShowDeleteModal(false),
			() => setShowDeleteModal(false)
		)
	}

	return (
		<div className="room">
			<Header
				title={'Database'}
				color="purple"
				className="corner-right"
				leftActions={<FontAwesomeIcon icon={faDatabase} size="lg" />}
				rightActions={<Button color="purple" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Action text="Reset database" description="Drops and recreates all tables to ensure they're the latest schemas.">
				<NotificationAwareButton
					notificationSources={['debug-reset']}
					color="primary"
					iconProps={{ icon: faFire }}
					onClick={() => setShowDeleteModal(true)}
				/>
			</Action>
			<ConfirmModal
				open={showDeleteModal}
				text="Are you sure you want to reset the database?"
				onConfirm={() => debugReset()}
				onClose={() => setShowDeleteModal(false)}
			/>
		</div>
	)
}
