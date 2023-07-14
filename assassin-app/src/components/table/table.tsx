import './table.css'
import { Table as MUITable, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

export interface TableProps {
	headers: (string|JSX.Element)[]
	className?: string
	rows: {
		name: string
		cells: JSX.Element
		onClick?: () => void
	}[]
}

export default function Table({ className, headers, rows }: TableProps) {
	return (
		<TableContainer className={`table ${className || ''}`}>
			<MUITable sx={{ borderRadius: "0.3rem" }}>
				<TableHead sx={{ borderRadius: "0.3rem" }}>
					<TableRow sx={{ borderRadius: "0.3rem" }}>
						{headers.map((header, i) => <TableCell align={i > 0 ? 'center' : undefined} key={`table-${className}-header-${i}`}>{i === 0 ? <strong>{header}</strong> : header}</TableCell>)}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row.name}
							className={row.onClick ? "clickable" : ''}
							onClick={row.onClick}
						>
							{row.cells}
						</TableRow>
					))}
				</TableBody>
			</MUITable>
			</TableContainer>
	)
}
