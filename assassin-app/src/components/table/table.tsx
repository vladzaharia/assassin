import { CommonColor } from '../../types'
import './table.css'

export interface TableCellProps {
	element: string | JSX.Element
	className?: string
}

export interface TableProps {
	headers?: TableCellProps[]
	className?: string
	color: CommonColor
	rows: {
		name: string
		cells: TableCellProps[]
		onClick?: () => void
	}[]
}

export default function Table({ color, className, headers, rows }: TableProps) {
	return (
		<div className={`table ${color} ${className || ''}`}>
			{headers && (
				<div className="table-header-wrapper">
					<div className="table-row table-header">
						{headers.map((header, i) => (
							<div className={`table-cell ${header.className || ''}`} key={`table-${className}-${i}-header`}>
								{header.element}
							</div>
						))}
					</div>
				</div>
			)}
			{rows.map((row, i) => (
				<div key={`table-${className}-${i}-row`} className={`table-row ${row.onClick ? 'clickable' : ''}`} onClick={row.onClick}>
					{row.cells.map((cell, j) => (
						<div className={`table-cell ${cell.className || ''}`} key={`table-${className}-${i}-${j}-cell`}>
							{cell.element}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
