/* eslint-disable react/jsx-no-useless-fragment */
import { faCrosshairs, faCrown, faUser, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BasicPlayer } from 'assassin-server-client'
import isMobile from 'is-mobile'
import { useContext, useRef, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import Popover from '../popover/popover'
import { RoomStatusContext } from '../room-status/room-status'
import './player-list.css'
import { ErrorFieldContext } from '../error/error'
import { useNavigate } from 'react-router-dom'

const getPlayerColor = (player: BasicPlayer) => {
	if (player.isGM) {
		return 'orange'
	} else if (player.status === 'eliminated') {
		return 'primary'
	}

	return ''
}

const getPlayerIcon = (player: BasicPlayer) => {
	if (player.isGM) {
		return faCrown
	} else if (player.status === 'eliminated') {
		return faCrosshairs
	}

	return faUser
}

export default function PlayerList() {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomStatusContext)
	const errorContext = useContext(ErrorFieldContext)
	const navigate = useNavigate()

	const [gmPopoverOpen, setGMPopoverOpen] = useState<boolean>(false)
	const gmPopoverAnchor = useRef<HTMLButtonElement>(null)

	const roomStatus = roomContext?.room

	const JoinLeaveButton = () => {
		const playerInRoom = roomStatus?.players.some((p) => p.name === name)

		return <button
			className={errorContext?.message && errorContext.message !== 'ok' ? 'failed' : 'primary'}
			onClick={!playerInRoom ? roomContext?.join : roomContext?.leave}
			disabled={!roomStatus || roomStatus.status === 'started'}>
			<FontAwesomeIcon icon={!playerInRoom ? faUserPlus : faUserMinus} />
		</button>
	}

	return (
		<div className="player-list">
			<div className="header">
				<h3>Player List</h3>
				<div className="buttons">
					{roomContext?.playerIsGM ?
						<>
							<button
								className={'blue'}
								onClick={() => navigate("gm")}
								ref={gmPopoverAnchor}
								onPointerEnter={() => {
									if (!isMobile()) {
										setGMPopoverOpen(true)
									}
								}}
								onPointerLeave={() => {
									if (!isMobile()) {
										setGMPopoverOpen(false)
									}
								}}
							>
								<FontAwesomeIcon icon={faCrown} />
							</button>
							<Popover
								title="GM Options"
								description={
									<>
										As the first player to join the room, you can control it! <br />
										<br /> <strong>Click here to set room options and start the game.</strong>
									</>
								}
								color="blue"
								icon={faCrown}
								anchor={gmPopoverAnchor.current}
								open={gmPopoverOpen}
								onClose={() => setGMPopoverOpen(false)}
							/>
						</> : undefined}
					<JoinLeaveButton />
				</div>
			</div>

			{roomStatus?.players.map((player) => {
				return (
					<div className={`player ${getPlayerColor(player)}`} key={player.name}>
						<FontAwesomeIcon icon={getPlayerIcon(player)} /> {player.name}
					</div>
				)
			})}
		</div>
	)
}
