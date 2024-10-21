import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import {
	getRecentTransactions,
	getTransactionsInTimeRange
} from './handlers/handleFetchTransactions'
import { getTransaction } from './handlers/handleFetchTransaction'
import { pollTransactionsCron } from './middleware'
import {ORIGINS, SERVER_PORT} from './constants'

const app = new Elysia()
	.use(pollTransactionsCron)
	.use(
		cors({
			origin: ORIGINS
		})
	)
	.onRequest(({ request: { method, url } }) =>
		console.log(`[${new Date().toLocaleString()}] Request: ${method} ${url}`)
	)
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
	.listen(SERVER_PORT)
