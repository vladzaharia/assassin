import { faCrown, faUser, faUserMinus, faUserPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isMobile from 'is-mobile'
import { useContext, useRef, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import Popover from '../popover/popover'
import { RoomStatusContext } from '../room-status/room-status'
import './player-list.css'

export interface PlayerListProps {
	clickGM: () => void
	requestError?: string
}

function PlayerList({ clickGM, requestError }: PlayerListProps) {
	const [name] = useLocalStorage('name', '')
	const roomContext = useContext(RoomStatusContext)

	const [gmPopoverOpen, setGMPopoverOpen] = useState<boolean>(false)
	const gmPopoverAnchor = useRef<HTMLButtonElement>(null)

	const roomStatus = roomContext?.room
	const playerIsGM = roomContext?.room?.players.filter((p) => p.isGM)[0]?.name === name

	return (
		<div className="player-list">
			<div className="header">
				<h3>Player List</h3>
				<div className="buttons">
					{playerIsGM ? (
						<>
							<button
								className={'orange'}
								onClick={clickGM}
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
								color="orange"
								icon={faCrown}
								anchor={gmPopoverAnchor.current}
								open={gmPopoverOpen}
								onClose={() => setGMPopoverOpen(false)}
							/>
						</>
					) : undefined}
					{roomStatus?.players.some((p) => p.name === name) ? (
						<button
							className={requestError && requestError !== 'ok' ? 'failed' : 'primary'}
							onClick={roomContext?.leave}
							disabled={!roomStatus || roomStatus.status === "started"}>
							<FontAwesomeIcon icon={faUserMinus} />
						</button>
					) : (
						<button
							className={requestError && requestError !== 'ok' ? 'failed' : 'green'}
							onClick={roomContext?.join}
							disabled={!roomStatus || roomStatus.status === "started"}
						>
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
