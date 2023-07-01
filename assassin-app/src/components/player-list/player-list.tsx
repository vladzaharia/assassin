import { useContext, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RoomStatusContext } from '../room-status/room-status'

import './player-list.css'
import { faCrown, faUser, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import useLocalStorage from 'use-local-storage'
import Popover from '../popover/popover'
import isMobile from 'is-mobile'

export interface PlayerListProps {
	clickGM: () => void
	requestError?: string
}

function PlayerList({ clickGM, requestError }: PlayerListProps) {
	const [name] = useLocalStorage("name", "")
	const roomContext = useContext(RoomStatusContext)
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
	const popoverAnchor = useRef<HTMLButtonElement>(null)

	const roomStatus = roomContext?.room
	const playerIsGM = roomContext?.room?.players.filter((p) => p.isGM)[0]?.name === name

	return (
		<div className="player-list">
			<div className="header">
				<h3>Player List</h3>
				<div className="buttons">
					{playerIsGM ?
							<>
								<button
									className={'orange'}
									onClick={clickGM}
									ref={popoverAnchor}
									onMouseEnter={() => {
										if (!isMobile()) {
											setPopoverOpen(true)
										}
									}}
									onMouseLeave={() => {
										if (!isMobile()) {
											setPopoverOpen(false)
										}
									}}>
									<FontAwesomeIcon icon={faCrown} />
								</button>
								<Popover
									title="GM Options"
									description={<>As the first player to join the room, you can control the game! <br /><br /> <strong>Click here to set room options.</strong></>}
									color="orange"
									icon={faCrown}
									anchor={popoverAnchor.current}
									open={popoverOpen}
									onClose={() => setPopoverOpen(false)} />
							</> : undefined}
					{roomStatus?.players.some((p) => p.name === name) ? (
						<button className={requestError && requestError !== 'ok' ? 'failed' : 'primary'} onClick={roomContext?.leave}>
							<FontAwesomeIcon icon={faUserMinus} />
						</button>
					) : (
						<button className={requestError && requestError !== 'ok' ? 'failed' : 'green'} onClick={roomContext?.join} disabled={!roomStatus}>
							<FontAwesomeIcon icon={faUserPlus} />
						</button>
					)}
				</div>
			</div>

			{roomStatus?.players.map((player) => {
				return (
					<div className="player" key={player.name}>
						<FontAwesomeIcon icon={player.isGM ? faCrown : faUser} /> {player.name}
					</div>
				)
			})}
		</div>
	)
}

export default PlayerList
