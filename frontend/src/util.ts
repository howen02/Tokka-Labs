import { BACKEND_URL } from '@/constants.ts'
import { Response, Transaction } from '@/types.ts'

export const fetchTransactions = (page: number, pageSize: number) =>
	Promise.resolve(
		new URLSearchParams({
			page: page.toString(),
			pageSize: pageSize.toString()
		})
	)
		.then(params => fetch(`${BACKEND_URL}/transactions?${params}`))
		.then(response => response.json())
		.then((data: Response<Transaction[]>) => data.body.data)

export const fetchTransactionByHash = (hash: string) =>
	fetch(`${BACKEND_URL}/transaction/${hash}`)
		.then(response => response.json())
		.then((data: Response<Transaction[]>) => data.body.data)

export const fetchTransactionsByTimeRange = (
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

export const fetchDecodedPrice = (hash: string) =>
	fetch(`${BACKEND_URL}/decode/${hash}`)
		.then(res => res.json())
		.then(data => data.body.data)

export const processDate = (date: Date) => Math.floor(date.getTime() / 1000)

export const validateHash = (hash: string) =>
	Promise.resolve(/^0x([A-Fa-f0-9]{64})$/.test(hash))
