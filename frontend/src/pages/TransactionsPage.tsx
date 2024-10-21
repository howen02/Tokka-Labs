import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TransactionsTable } from '@/components/TransactionsTable.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { DateRangePicker } from '@/components/DateRangePicker.tsx'
import { DateRange } from 'react-day-picker'
import { X } from 'lucide-react'
import EthPriceCard from '@/components/EthPrice.tsx'
import PriceDecoderCard from '@/components/PriceDecoderCard.tsx'
import {
	fetchTransactionByHash,
	fetchTransactions,
	fetchTransactionsByTimeRange,
	processDate
} from '@/util.ts'

function TransactionsPage() {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(50)
	const [transactionHash, setTransactionHash] = useState('')
	const [dateRange, setDateRange] = useState<DateRange | undefined>()

	const {
		data: transactions,
		isLoading,
		refetch
	} = useQuery({
		queryKey: [
			'transactions',
			{
				page,
				pageSize,
				hash: transactionHash.trim() || undefined,
				start: dateRange?.from ? processDate(dateRange.from) : undefined,
				end: dateRange?.to ? processDate(dateRange.to) : undefined
			}
		],
		queryFn: ({
			queryKey
		}: {
			queryKey: [
				string,
				{
					page: number
					pageSize: number
					hash?: string
					start?: number
					end?: number
				}
			]
		}) => {
			const [_, { page, pageSize, hash, start, end }] = queryKey
			switch (true) {
				case !!hash:
					return fetchTransactionByHash(hash)
				case start !== undefined && end !== undefined:
					return fetchTransactionsByTimeRange(start, end, page, pageSize)
				default:
					return fetchTransactions(page, pageSize)
			}
		},
		staleTime: 1000,
		refetchInterval: transactionHash || dateRange ? false : 1000
	})

	const handlePageChange = (newPage: number) => setPage(newPage)

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize)
		setPage(1)
	}

	const handleDateRangeChange = (newDateRange: DateRange | undefined) =>
		setDateRange(newDateRange)

	const handleResetFilters = () => {
		setTransactionHash('')
		setDateRange(undefined)
		setPage(1)
		refetch().then()
	}

	const hasNextPage =
		(transactions && transactions.length === pageSize) ?? false

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="w-[600px] flex flex-col gap-2">
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Search hash"
						value={transactionHash}
						onChange={e => setTransactionHash(e.target.value.trim())}
					/>
					<DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
					<Button
						className="w-2"
						variant="destructive"
						onClick={handleResetFilters}
					>
						<X />
					</Button>
					<EthPriceCard />
				</div>
				<TransactionsTable
					isLoading={isLoading}
					transactions={transactions || []}
					page={page}
					pageSize={pageSize}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
					hasNextPage={hasNextPage}
				/>
				<PriceDecoderCard />
			</div>
		</div>
	)
}

export default TransactionsPage
