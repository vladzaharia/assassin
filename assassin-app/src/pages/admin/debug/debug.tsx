import { useNavigate } from 'react-router-dom'
import './debug.css'
import Header from '../../../components/header/header'
import Button, { NotificationAwareButton } from '../../../components/button/button'
import { faCog, faDoorOpen, faFire, faTextSize, faXmark } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Action from '../../../components/action/action'
import { createAdminApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { NotificationContext } from '../../../hooks/notification'
import { isAxiosError } from 'axios'
import { useContext, useState } from 'react'
import { ConfirmModal } from '../../../components/modal/modal'

export default function AdminDebug() {
	const navigate = useNavigate()
	const auth = useAuth()
	const { setError, setNotification } = useContext(NotificationContext)
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

	const api = createAdminApi(auth.user?.access_token || '')

	const debugReset = async () => {
		try {
			await api.debugReset()
			setNotification({
				message: `Database reset successfully!`,
				notificationType: 'success',
				source: 'debug-reset',
				icon: faFire,
			})

			setShowDeleteModal(false)
		} catch (e) {
			setShowDeleteModal(false)

			if (isAxiosError(e)) {
				setError(e.response?.data?.message || e.message, 'debug-reset')
			} else {
				setError('Something went wrong!', 'debug-reset')
			}
		}
	}

	const debugInitWordlists = async () => {
		try {
			await api.debugInit({
				wordLists: ['test-list', 'card-poison', 'card-dagger', 'team-galactic', 'team-green', 'countries', 'technology', 'pokemon'],
			})
			setNotification({
				message: `Wordlist initialized successfully!`,
				notificationType: 'success',
				source: 'debug-init',
				icon: faTextSize,
			})
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data?.message || e.message, 'debug-init')
			} else {
				setError('Something went wrong!', 'debug-init')
			}
		}
	}

	const debugInitDemoRoom = async () => {
		try {
			await api.debugInit({
				room: 'test',
				players: ['Vlad', 'George', 'John'],
			})
			setNotification({
				message: `Demo room (test) initialized successfully!`,
				notificationType: 'success',
				source: 'debug-demo',
				icon: faDoorOpen,
			})
		} catch (e) {
			if (isAxiosError(e)) {
				setError(e.response?.data?.message || e.message, 'debug-demo')
			} else {
				setError('Something went wrong!', 'debug-demo')
			}
		}
	}

	return (
		<div className="room">
			<Header
				title={'Debug'}
				className="purple corner-right"
				leftActions={<FontAwesomeIcon icon={faCog} size="lg" />}
				rightActions={<Button className="purple" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<Action text="Reset database" description="Drops and recreates all tables to ensure they're the latest schemas.">
				<NotificationAwareButton
					notificationSources={['debug-reset']}
					className="primary"
					iconProps={{ icon: faFire }}
					onClick={() => setShowDeleteModal(true)}
				/>
			</Action>
			<Action text="Initialize wordlists" description="Adds initial wordlists to database.">
				<NotificationAwareButton
					notificationSources={['debug-init']}
					className="blue"
					iconProps={{ icon: faTextSize }}
					onClick={() => debugInitWordlists()}
				/>
			</Action>
			<Action text="Initialize demo room" description="Adds demo room to database.">
				<NotificationAwareButton
					notificationSources={['debug-demo']}
					className="green"
					iconProps={{ icon: faDoorOpen }}
					onClick={() => debugInitDemoRoom()}
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
