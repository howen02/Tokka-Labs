import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from './ui/table'
import { Transaction } from '../types.ts'
import { ScrollArea } from './ui/scroll-area.tsx'
import { Button } from './ui/button.tsx'
import { SelectPageSize } from './SelectPageSize.tsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type TransactionsTableProps = {
	transactions: Transaction[] | Transaction
	page: number
	pageSize: number
	onPageChange: (page: number) => void
	onPageSizeChange: (pageSize: number) => void
	hasNextPage: boolean // New prop to indicate if there are more transactions
}

export function TransactionsTable({
	transactions,
	page,
	onPageChange,
	onPageSizeChange,
	hasNextPage
}: TransactionsTableProps) {
	transactions = Array.isArray(transactions) ? transactions : [transactions]
	const totalGasUsed = transactions.reduce(
		(total, transaction) => total + transaction.gasUsed,
		0
	)

	const handlePageSizeChange = (newPageSize: number) => {
		onPageSizeChange(newPageSize)
	}

	return (
		<div className="w-full rounded-2xl overflow-hidden border border-gray-200">
			<ScrollArea className="h-[400px] w-full rounded-md border">
				<Table>
					<TableHeader className="bg-white sticky top-0 z-10">
						<TableRow>
							<TableHead>Hash</TableHead>
							<TableHead>Block</TableHead>
							<TableHead>USDT</TableHead>
							<TableHead>ETH</TableHead>
							<TableHead>Timestamp</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map(transaction => (
							<TableRow key={transaction.hash}>
								<TableCell>
									{transaction.hash.slice(0, 6) +
										'...' +
										transaction.hash.slice(-4)}
								</TableCell>
								<TableCell>{transaction.blockNumber}</TableCell>
								<TableCell>{transaction.gasUsed}</TableCell>
								<TableCell>{transaction.gasUsed}</TableCell>
								<TableCell className="tabular-nums">
									{new Date(transaction.timeStamp * 1000).toLocaleString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
			<div className="flex py-1 px-2 justify-between items-center">
				<div className="flex gap-1">
					<p className="font-semibold">Total Gas Used:</p>
					<p>{totalGasUsed} Gwei</p>
				</div>
				<div className="flex gap-2 justify-center items-center">
					<SelectPageSize onPageSizeChange={handlePageSizeChange} />
					<Button
						variant="ghost"
						onClick={() => (page > 1 ? onPageChange(page - 1) : null)}
						disabled={page === 1}
					>
						<ChevronLeft />
					</Button>
					<p className="min-w-[20px] text-center">{page}</p>
					<Button
						variant="ghost"
						onClick={() => onPageChange(page + 1)}
						disabled={!hasNextPage}
					>
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	)
}
