import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '@/constants.ts'
import { Transaction, Response } from '@/types.ts'
import { TransactionsTable } from '@/components/TransactionsTable.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { DateRangePicker } from '@/components/DateRangePicker.tsx'
import { DateRange } from 'react-day-picker'
import { X } from 'lucide-react'
import EthPriceCard from '@/components/EthPrice.tsx'

const fetchTransactions = (page: number, pageSize: number) =>
	Promise.resolve(
		new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString()
		})
	)
		.then(params => fetch(`${BACKEND_URL}/transactions?${params}`))
		.then(response => response.json())
		.then((data: Response<Transaction[]>) => data.body.data)

const fetchTransactionByHash = (hash: string) =>
	fetch(`${BACKEND_URL}/transaction/${hash}`)
		.then(response => response.json())
		.then((data: Response<Transaction[]>) => data.body.data)

const fetchTransactionsByTimeRange = (
	start: number,
	end: number,
	page: number,
	pageSize: number
) =>
	Promise.resolve(
		new URLSearchParams({
			start: start.toString(),
			end: end.toString(),
			page: page.toString(),
			pageSize: pageSize.toString()
		})
	)
		.then(params => fetch(`${BACKEND_URL}/transactions/range?${params}`))
		.then(response => response.json())
		.then((data: Response<Transaction[]>) => data.body.data)

const processDate = (date: Date) => Math.floor(date.getTime() / 1000)

function TransactionsPage() {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(50)
	const [transactionHash, setTransactionHash] = useState('')
	const [dateRange, setDateRange] = useState<DateRange | undefined>()

	const { data: transactions } = useQuery({
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
		staleTime: 10 * 60 * 1000,
		// refetchInterval: 1000
	})

	const handlePageChange = (newPage: number) => setPage(newPage)

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize)
		setPage(1)
	}

	const handleDateRangeChange = (newDateRange: DateRange | undefined) =>
		setDateRange(newDateRange)

	const resetFilters = () => {
		setTransactionHash('')
		setDateRange(undefined)
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
					<Button className="w-2" variant="destructive" onClick={resetFilters}>
						<X />
					</Button>
					<EthPriceCard />
				</div>
				<TransactionsTable
					transactions={transactions || []}
					page={page}
					pageSize={pageSize}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
					hasNextPage={hasNextPage}
				/>
			</div>
		</div>
	)
}

export default TransactionsPage
