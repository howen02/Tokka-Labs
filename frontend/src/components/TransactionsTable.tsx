import { useMemo } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { SelectPageSize } from './SelectPageSize'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Transaction } from '@/types.ts'

type TransactionsTableProps = {
	transactions: Transaction[] | Transaction
	page: number
	pageSize: number
	onPageChange: (page: number) => void
	onPageSizeChange: (pageSize: number) => void
	hasNextPage: boolean
	isLoading: boolean
}

const calculateGasCost = (
	gasUsed: number,
	gasPrice: number,
	ethPrice: number
) => {
	const gasCostWei = BigInt(gasUsed) * BigInt(gasPrice)
	const gasCostEth = Number(gasCostWei) / 1e18
	const gasCostUsdt = gasCostEth * ethPrice
	return { gasCostEth, gasCostUsdt }
}

export function TransactionsTable({
	transactions,
	page,
	onPageChange,
	onPageSizeChange,
	hasNextPage,
	isLoading
}: TransactionsTableProps) {
	const transactionsArray =
		Array.isArray(transactions) ? transactions : [transactions]

	const handlePageSizeChange = (newPageSize: number) => {
		onPageSizeChange(newPageSize)
	}

	const navigateToEtherscan = (hash: string) =>
		window.open(`https://etherscan.io/tx/${hash}`, '_blank')

	const transactionsWithGasCosts = useMemo(
		() =>
			transactionsArray.map(tx => ({
				...tx,
				...calculateGasCost(tx.gasUsed, tx.gasPrice, tx.ethPrice)
			})),
		[transactionsArray]
	)
	const totalGasCosts = useMemo(() => {
		return transactionsWithGasCosts.reduce(
			(acc, tx) => ({
				eth: acc.eth + tx.gasCostEth,
				usdt: acc.usdt + tx.gasCostUsdt
			}),
			{ eth: 0, usdt: 0 }
		)
	}, [transactionsArray])

	return (
		<div className="w-full rounded-2xl overflow-hidden border border-gray-200">
			<ScrollArea className="h-[400px] w-full rounded-md border">
				<Table>
					<TableHeader className="bg-white sticky top-0 z-10">
						<TableRow>
							<TableHead className="w-1/6">Hash</TableHead>
							<TableHead className="w-1/6">Block</TableHead>
							<TableHead className="w-1/6">USDT</TableHead>
							<TableHead className="w-1/6">ETH</TableHead>
							<TableHead className="w-1/3">Timestamp</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ?
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									<Loader2 className="h-8 w-8 animate-spin mx-auto" />
									<p className="mt-2">
										Loading transactions... This may take a while for older
										data.
									</p>
								</TableCell>
							</TableRow>
						:	transactionsWithGasCosts.map(transaction => (
								<TableRow key={transaction.hash} className="tabular-nums">
									<TableCell
										className="w-1/6 cursor-pointer text-blue-500"
										onClick={() => navigateToEtherscan(transaction.hash)}
										title="View on Etherscan"
									>
										{transaction.hash.slice(0, 5) +
											'...' +
											transaction.hash.slice(-3)}
									</TableCell>
									<TableCell className="w-1/6">
										{transaction.blockNumber}
									</TableCell>
									<TableCell className="w-1/6">
										${transaction.gasCostUsdt.toFixed(2)}
									</TableCell>
									<TableCell className="w-1/6">
										{transaction.gasCostEth.toFixed(6)}
									</TableCell>
									<TableCell className="w-1/3">
										{new Date(transaction.timeStamp * 1000).toLocaleString()}
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</ScrollArea>
			<div className="flex p-2 justify-between items-center">
				<div className="flex gap-1 text-gray-600">
					<p className="font-semibold">Total:</p>
					<div className="flex items-center gap-1">
						<p>${totalGasCosts.usdt.toFixed(2)}</p>
						<p>/</p>
						<p>{totalGasCosts.eth.toFixed(4)} ETH</p>
					</div>
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
