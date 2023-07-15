import { Modal as MUIModal, ModalProps } from '@mui/material'
import './modal.css'

export default function Modal({ className, ...props }: ModalProps) {
	return <MUIModal className={`modal ${className || ''}`} {...props} />
}
