import { Modal as MUIModal, ModalProps } from '@mui/material'
import './modal.css'
import Button from '../button/button'
import { ContainerContext } from '../../context/container'
import { useContext } from 'react'
import Header from '../header/header'
import { faXmark } from '@fortawesome/pro-solid-svg-icons'

export default function Modal({ className, children, ...props }: Omit<ModalProps, 'container'>) {
	const container = useContext(ContainerContext)

	return (
		<MUIModal {...props} container={container?.current} className={`modal ${className || ''}`}>
			<div className="modal-content">{children}</div>
		</MUIModal>
	)
}

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
	text: string
	onConfirm: () => void
}

export function ConfirmModal({ className, text, onConfirm, ...props }: ConfirmModalProps) {
	return (
		<Modal {...props} className={`confirm-modal ${className || ''}`}>
			<>
				<Header
					className="corner-left-05 corner-right-05"
					rightActions={
						<div className="player-info-buttons">
							<Button
								className="primary"
								iconProps={{ icon: faXmark }}
								onClick={() => props.onClose && props.onClose({}, 'escapeKeyDown')}
							/>
						</div>
					}
				/>
				<div className="modal-message-wrapper">
					<span className="modal-message">{text}</span>
					<div className="modal-buttons">
						<Button className="primary" text="No" onClick={() => props.onClose && props.onClose({}, 'escapeKeyDown')} />
						<Button className="green" text="Yes" onClick={onConfirm} />
					</div>
				</div>
			</>
		</Modal>
	)
}
