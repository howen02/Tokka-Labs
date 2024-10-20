import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '@/constants.ts'
import { Transaction, Response } from '@/types.ts'
import { TransactionsTable } from '@/components/TransactionsTable.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { DateRangePicker } from '@/components/DateRangePicker.tsx'
import { DateRange } from 'react-day-picker'
import {X} from "lucide-react";

function TransactionsPage() {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(50)
	const [transactionHash, setTransactionHash] = useState('')
	const [dateRange, setDateRange] = useState<DateRange | undefined>()

	const fetchTransactions = ({
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
		const [_key, { page, pageSize, hash, start, end }] = queryKey

		let url = `${BACKEND_URL}/transactions?page=${page}&pageSize=${pageSize}`

		if (hash) {
			url = `${BACKEND_URL}/transaction/${hash}`
		} else if (start !== undefined && end !== undefined) {
			url = `${BACKEND_URL}/transactions/range?start=${start}&end=${end}&page=${page}&pageSize=${pageSize}`
		}

		return fetch(url)
			.then(response => response.json())
			.then((data: Response<Transaction[]>) => data.body.data)
	}

	const { data: transactions } = useQuery({
		queryKey: [
			'transactions',
			{
				page,
				pageSize,
				hash: transactionHash || undefined,
				start:
					dateRange?.from ?
						Math.floor(dateRange.from.getTime() / 1000)
					:	undefined,
				end:
					dateRange?.to ? Math.floor(dateRange.to.getTime() / 1000) : undefined
			}
		],
		queryFn: fetchTransactions,
		staleTime: 10 * 60 * 1000,
		refetchInterval: 1000
	})

	const handlePageChange = (newPage: number) => {
		setPage(newPage)
	}

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize)
		setPage(1)
	}

	const handleDateRangeChange = (newDateRange: DateRange | undefined) =>
		setDateRange(newDateRange)

	const hasNextPage =
		(transactions && transactions.length === pageSize) ?? false

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="w-[600px] flex flex-col gap-2">
				<div className="flex gap-2">
					<Input
						type="text"
						placeholder="Transaction hash"
						value={transactionHash}
						onChange={e => setTransactionHash(e.target.value)}
					/>
					<Button className="w-2" variant="destructive" onClick={() => setTransactionHash('')}><X/></Button>
					<DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
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
