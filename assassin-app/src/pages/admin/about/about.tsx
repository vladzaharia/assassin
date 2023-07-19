import { faBook, faBrowser, faCircleInfo, faCog, faFile, faLink, faList, faRocket, faWebhook } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ServerInfo200Response } from 'assassin-server-client'
import { useLoaderData } from 'react-router-dom'
import Action from '../../../components/action/action'
import Header from '../../../components/header/header'
import SectionTitle from '../../../components/section-title/section-title'
import './about.css'
import moment from 'moment'

type URLType = 'ui' | 'admin' | 'api' | 'openapi' | 'docs'

export default function AdminAbout() {
	const info = useLoaderData() as ServerInfo200Response

	const getURLIcon = (urlType: URLType) => {
		switch (urlType) {
			case 'ui':
				return faBrowser
			case 'admin':
				return faCog
			case 'api':
				return faWebhook
			case 'openapi':
				return faFile
			case 'docs':
				return faBook
		}
	}

	const getURLName = (urlType: URLType) => {
		switch (urlType) {
			case 'ui':
				return 'Frontend'
			case 'admin':
				return 'Admin'
			case 'api':
				return 'API'
			case 'openapi':
				return 'OpenAPI Schema'
			case 'docs':
				return 'OpenAPI Docs'
		}
	}

	return (
		<div className="room">
			<Header title={'About'} color="primary" className="corner-right" leftActions={<FontAwesomeIcon icon={faCircleInfo} size="lg" />} />
			<SectionTitle color="primary">
				<FontAwesomeIcon className="mr-05" icon={faList} /> Details
			</SectionTitle>
			<Action text="Environment" description="Environment Word Assassin was deployed to.">
				{info.env}
			</Action>
			{info.deployment ? (
				<>
					<Action text="App version" description="Version of the deployed frontend app.">
						v{info.deployment.version.app}
					</Action>
					<Action text="Server version" description="Version of the deployed backend API.">
						v{info.deployment.version.server}
					</Action>
				</>
			) : undefined}
			<SectionTitle color="primary">
				<FontAwesomeIcon className="mr-05" icon={faLink} /> URLs
			</SectionTitle>
			<div className="url-list">
				{Object.entries(info.urls).map((record) => (
					<a href={record[1]} className="url-entry">
						<span className="icon">
							<FontAwesomeIcon icon={getURLIcon(record[0] as URLType)} />
						</span>
						<span className="name fw-600">{getURLName(record[0] as URLType)}</span>
						<span className="url">{record[1]}</span>
					</a>
				))}
			</div>
			{info.deployment ? (
				<>
					<SectionTitle color="primary">
						<FontAwesomeIcon className="mr-05" icon={faRocket} /> Deployment
					</SectionTitle>
					<Action text="Deployment time" description="When the app and API were deployed.">
						<span className="deployment-time">
							<span className="fw-500">{moment.unix(info.deployment.time).calendar()}</span>
							<span className="description">{moment.unix(info.deployment.time).utc().format('MMM Do YYYY, HH:mm')} UTC</span>
						</span>
					</Action>
					{info.deployment.git ? (
						<>
							<Action text="Deployment source" description="Source of deployment, either 'local' or the git repository.">
								{info.deployment.git.source}
							</Action>
							<Action text="Branch" description="Git branch this instance was deployed from.">
								{info.deployment.git.ref}
							</Action>
							<Action text="SHA" description="SHA hash of the deployment commit.">
								{info.deployment.git.sha}
							</Action>
						</>
					) : undefined}
				</>
			) : undefined}
		</div>
	)
}
