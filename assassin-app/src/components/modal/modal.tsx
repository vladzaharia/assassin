import { Modal as MUIModal, ModalProps } from '@mui/material'
import './modal.css'
import Button from '../button/button'
import { ContainerContext } from '../../hooks/container'
import { useContext, useState } from 'react'
import Header from '../header/header'
import { IconDefinition, faCheck, faPlus, faXmark } from '@fortawesome/pro-solid-svg-icons'
import Action from '../action/action'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Modal({ className, children, ...props }: Omit<ModalProps, 'container'>) {
	const container = useContext(ContainerContext)

	return (
		<MUIModal {...props} container={container?.current} className={`modal ${className || ''}`}>
			<div className="modal-content">{children}</div>
		</MUIModal>
	)
}

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
	icon?: IconDefinition
	text: string | JSX.Element
	onConfirm: () => void
}

export function ConfirmModal({ className, icon, text, title, onConfirm, ...props }: ConfirmModalProps) {
	return (
		<Modal {...props} className={`confirm-modal ${className || ''}`}>
			<>
				<Header
					className="corner-left-05 corner-right-05"
					title={
						<>
							<FontAwesomeIcon className="mr-05" icon={icon || faCheck} /> {title || 'Confirm'}
						</>
					}
					rightActions={
						<div className="modal-header-buttons">
							<Button color="primary" iconProps={{ icon: faXmark }} onClick={() => props.onClose && props.onClose({}, 'escapeKeyDown')} />
						</div>
					}
				/>
				<div className="modal-message-wrapper">
					<span className="modal-message">{text}</span>
					<div className="modal-buttons">
						<Button
							color="primary"
							iconProps={{ icon: faXmark }}
							text="No"
							onClick={() => props.onClose && props.onClose({}, 'escapeKeyDown')}
						/>
						<Button color="green" iconProps={{ icon: faCheck }} text="Yes" onClick={onConfirm} />
					</div>
				</div>
			</>
		</Modal>
	)
}

export interface CreateModalProps extends Omit<ModalProps, 'children'> {
	icon?: IconDefinition
	text: string
	description: string
	onCreate: (inputValue: string) => void
}

export function CreateModal({
	className,
	text,
	icon,
	title,
	description,
	onCreate: onCreateProp,
	onClose: onCloseProp,
	...props
}: CreateModalProps) {
	const [inputText, setInputText] = useState<string>('')

	const onCreate = () => {
		setInputText('')
		onCreateProp(inputText)
	}

	const onClose = () => {
		setInputText('')
		onCloseProp && onCloseProp({}, 'backdropClick')
	}

	return (
		<Modal {...props} className={`create-modal ${className || ''}`} onClose={onClose}>
			<>
				<Header
					className="corner-left-05 corner-right-05"
					title={
						<>
							<FontAwesomeIcon className="mr-05" icon={icon || faPlus} /> {title || 'Create'}
						</>
					}
					rightActions={
						<div className="modal-header-buttons">
							<Button color="primary" iconProps={{ icon: faXmark }} onClick={onClose} />
						</div>
					}
				/>
				<Action className="create-input column" text={text} description={description}>
					<div className="input-wrapper">
						<input type="text" value={inputText} onChange={(e) => setInputText(e.currentTarget.value)} />
					</div>
				</Action>
				<Action>
					<Button color="green" iconProps={{ icon: faPlus }} text="Create" onClick={onCreate} />
				</Action>
			</>
		</Modal>
	)
}
