import { Elysia } from 'elysia'
import { pollTransactions } from './services/pollTransactions'
import cors from '@elysiajs/cors'
import {
	getRecentTransactions,
	getTransactionsInTimeRange
} from './handlers/handleFetchTransactions'
import { getTransaction } from './handlers/handleFetchTransaction'

const app = new Elysia()
	.use(cors())
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
pollTransactions()
