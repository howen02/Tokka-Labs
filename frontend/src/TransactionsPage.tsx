import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '@/constants.ts'
import { Transaction, Response } from '@/types.ts'
import { TransactionsTable } from '@/components/TransactionsTable.tsx'

function TransactionsPage() {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(50)

	const fetchTransactions = ({
		queryKey
	}: {
		queryKey: [string, { page: number; pageSize: number }]
	}) => {
		const [_key, { page, pageSize }] = queryKey

		return Promise.resolve(
			new URLSearchParams({
				page: page.toString(),
				pageSize: pageSize.toString()
			})
		)
			.then(params => fetch(BACKEND_URL + '/transactions?' + params))
			.then(response => response.json())
			.then((data: Response<Transaction[]>) => data.body.data)
	}

	const { data: transactions } = useQuery({
		queryKey: ['transactions', { page, pageSize }],
		queryFn: fetchTransactions,
		staleTime: 5000
	})

	const handlePageChange = (newPage: number) => {
		setPage(newPage)
	}

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize)
		setPage(1)
	}

	const hasNextPage =
		(transactions && transactions.length === pageSize) ?? false

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="w-[600px]">
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
