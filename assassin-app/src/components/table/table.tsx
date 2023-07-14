import './table.css'

export interface TableProps {
	headers?: (string | JSX.Element)[]
	className?: string
	rows: {
		name: string
		cells: (string | JSX.Element)[]
		onClick?: () => void
	}[]
}

export default function Table({ className, headers, rows }: TableProps) {
	return (
		<div className={`table ${className || ''}`}>
			{headers && (
				<div className="table-row table-header">
					{headers.map((header, i) => (
						<div className="table-cell" key={`table-${className}-header-${i}`}>
							{i === 0 ? <strong>{header}</strong> : header}
						</div>
					))}
				</div>
			)}
			{rows.map((row, i) => (
				<div key={row.name} className={`table-row ${row.onClick ? 'clickable' : ''}`} onClick={row.onClick}>
					{row.cells.map((cell, j) => (
						<div className="table-cell" key={`table-${className}-${i}-${j}-cell`}>
							{cell}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
