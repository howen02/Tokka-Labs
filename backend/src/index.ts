import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import {
	getRecentTransactions,
	getTransactionsInTimeRange
} from './handlers/handleFetchTransactions'
import { getTransaction } from './handlers/handleFetchTransaction'
import { pollTransactionsCron } from './middleware'

const app = new Elysia()
	.use(cors())
	.use(pollTransactionsCron)
	.onRequest(context => {
		const { method, url } = context.request
		console.log(`Request: ${method} ${url}`)
	})
	.group('/transactions', app =>
		app
			.get('/', ({ query: { page = 1, pageSize = 50 } }) =>
				getRecentTransactions(Number(page), Number(pageSize))
			)
			.get(
				'/range',
				({
					query: { start = '0', end = `${Date.now()}`, page = 1, pageSize = 50 }
				}) =>
					getTransactionsInTimeRange(start, end, Number(page), Number(pageSize))
			)
	)
	.get('/transaction/:hash', ({ params: { hash } }) => getTransaction(hash))
	.listen(3000)

console.log(`Backend is running at ${app.server?.hostname}:${app.server?.port}`)
