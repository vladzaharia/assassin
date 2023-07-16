import { useNavigate } from 'react-router-dom'
import './database.css'
import Header from '../../../components/header/header'
import Button, { NotificationAwareButton } from '../../../components/button/button'
import {
	faArrowRotateLeft,
	faCheck,
	faCheckDouble,
	faDatabase,
	faFire,
	faList,
	faRightLeftLarge,
	faSparkles,
	faXmark,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Action from '../../../components/action/action'
import { createDatabaseApi } from '../../../api'
import { useAuth } from 'react-oidc-context'
import { useNotificationAwareRequest } from '../../../hooks/notification'
import { useEffect, useState } from 'react'
import { ConfirmModal } from '../../../components/modal/modal'
import { GetDatabase200Response } from 'assassin-server-client'
import SectionTitle from '../../../components/section-title/section-title'
import Table from '../../../components/table/table'
import moment from 'moment'

export default function AdminDatabase() {
	const request = useNotificationAwareRequest()
	const navigate = useNavigate()
	const auth = useAuth()

	const [database, setDatabase] = useState<GetDatabase200Response>()
	const [showMigrateModal, setShowMigrateModal] = useState<boolean>(false)
	const [showRollbackModal, setShowRollbackModal] = useState<boolean>(false)
	const [showResetModal, setShowResetModal] = useState<boolean>(false)

	const api = createDatabaseApi(auth.user?.access_token || '')

	const cannotMigrate = database?.migrations?.current === undefined || (database?.migrations?.available || []).length === 0
	const cannotRollback = database?.migrations?.current?.version === 0

	const getDb = async () => {
		await request(
			async () => await api.getDatabase(),
			undefined,
			(db) => setDatabase(db.data)
		)
	}

	const migrateDb = async () => {
		if (!cannotMigrate) {
			await request(
				async () => await api.migrateDatabase(),
				{
					message: `Database migrated successfully!`,
					source: 'db-migrate',
					icon: faRightLeftLarge,
				},
				() => {
					setShowMigrateModal(false)
					getDb()
				},
				() => setShowMigrateModal(false)
			)
		}
	}

	const rollbackDb = async () => {
		if (!cannotRollback) {
			await request(
				async () => await api.rollbackDatabase(),
				{
					message: `Migration rolled back successfully!`,
					source: 'db-migrate',
					icon: faArrowRotateLeft,
				},
				() => {
					setShowRollbackModal(false)
					getDb()
				},
				() => setShowRollbackModal(false)
			)
		}
	}

	const resetDb = async () => {
		await request(
			async () => await api.resetDatabase(),
			{
				message: `Database reset successfully!`,
				source: 'db-reset',
				icon: faFire,
			},
			() => {
				setShowResetModal(false)
				getDb()
			},
			() => setShowResetModal(false)
		)
	}

	useEffect(() => {
		getDb()

		const intervalId = setInterval(() => {
			getDb()
		}, 15 * 1000)
		return () => clearInterval(intervalId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="room">
			<Header
				title={'Database'}
				color="purple"
				className="corner-right"
				leftActions={<FontAwesomeIcon icon={faDatabase} size="lg" />}
				rightActions={<Button color="purple" onClick={() => navigate(`/admin`)} iconProps={{ icon: faXmark }} />}
			/>
			<SectionTitle color="purple">
				<FontAwesomeIcon className="mr-05" icon={faList} /> Details
			</SectionTitle>
			<Action text="Database binding" description="Name of the database the server is connected to.">
				<span className="database-binding">
					<span className="database-name">{database?.binding?.database}</span>
					<span className="description">({database?.binding?.type})</span>
				</span>
			</Action>
			<Action text="Database version" description="Latest migration version applied.">
				<span className="mr-1">{database?.migrations?.current?.version.toString() || ''}</span>
			</Action>
			<Action text="Reset database" description="Drops all tables in database.">
				<NotificationAwareButton
					notificationSources={['db-reset']}
					color="primary"
					iconProps={{ icon: faFire }}
					onClick={() => setShowResetModal(true)}
				/>
			</Action>

			{database?.migrations?.applied ? (
				<>
					<SectionTitle color="purple">
						<div className="section-title-with-action">
							<span>
								<FontAwesomeIcon className="mr-05" icon={faRightLeftLarge} /> Applied Migrations
							</span>
							<NotificationAwareButton
								notificationSources={['db-rollback']}
								color="blue"
								iconProps={{ icon: faArrowRotateLeft }}
								onClick={() => setShowRollbackModal(true)}
								disabled={cannotRollback}
							/>
						</div>
					</SectionTitle>

					<Table
						color="purple"
						headers={[
							{ element: 'Migration name' },
							{ element: 'Version', className: 'show-mobile' },
							{ element: 'Applied', className: 'show-mobile' },
							{ element: 'Rolled back', className: 'no-mobile' },
						]}
						rows={database.migrations.applied.map((migration) => {
							return {
								name: migration.name,
								cells: [
									{
										element: (
											<>
												<FontAwesomeIcon className="mr-05 migration-icon" icon={migration.rolledBack ? faArrowRotateLeft : faCheck} />{' '}
												{migration.name}
											</>
										),
									},
									{
										element: migration.version.toString(),
										className: 'show-mobile',
									},
									{ element: moment(migration.applied).fromNow(), className: 'show-mobile' },
									{
										element: migration.rolledBack ? moment(migration.rolledBack).fromNow() : '',
										className: 'no-mobile',
									},
								],
							}
						})}
					/>
				</>
			) : undefined}

			{database?.migrations?.available ? (
				<>
					<SectionTitle color="purple">
						<div className="section-title-with-action">
							<span>
								<FontAwesomeIcon className="mr-05" icon={faSparkles} /> Available Migrations
							</span>
							<NotificationAwareButton
								notificationSources={['db-migrate']}
								color="green"
								iconProps={{ icon: faCheckDouble }}
								onClick={() => setShowMigrateModal(true)}
								disabled={cannotMigrate}
							/>
						</div>
					</SectionTitle>

					<Table
						color="purple"
						headers={[{ element: 'Migration name' }, { element: 'Version' }]}
						rows={database.migrations.available.map((migration) => {
							return {
								name: migration.name,
								cells: [
									{
										element: (
											<>
												<FontAwesomeIcon className="mr-05 migration-icon" icon={faRightLeftLarge} /> {migration.name}
											</>
										),
									},
									{
										element: migration.version.toString(),
									},
								],
							}
						})}
					/>
				</>
			) : undefined}

			<ConfirmModal
				open={showMigrateModal}
				text="Are you sure you want to migrate the database?"
				onConfirm={() => migrateDb()}
				onClose={() => setShowMigrateModal(false)}
			/>
			<ConfirmModal
				open={showRollbackModal}
				text="Are you sure you want to rollback the latest migration?"
				onConfirm={() => rollbackDb()}
				onClose={() => setShowRollbackModal(false)}
			/>
			<ConfirmModal
				open={showResetModal}
				text="Are you sure you want to reset the database?"
				onConfirm={() => resetDb()}
				onClose={() => setShowResetModal(false)}
			/>
		</div>
	)
}
