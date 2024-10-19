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
	transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
	const totalGasUsed = transactions.reduce(
		(total, transaction) => total + transaction.gasUsed,
		0
	)

	return (
		<div className="w-full rounded-2xl overflow-hidden border border-gray-200">
			<ScrollArea className="h-[400px] w-full rounded-md border">
				<Table>
					<TableHeader className="bg-white sticky top-0 z-10">
						<TableRow>
							<TableHead>Hash</TableHead>
							<TableHead>Block</TableHead>
							<TableHead>Timestamp</TableHead>
							<TableHead>Gas</TableHead>
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
								<TableCell>{transaction.timeStamp}</TableCell>
								<TableCell>{transaction.gasUsed}</TableCell>
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
					<SelectPageSize />
					<Button variant="ghost">
						<ChevronLeft />
					</Button>
					<p>1</p>
					<Button variant="ghost">
						<ChevronRight />
					</Button>
				</div>
			</div>
		</div>
	)
}
