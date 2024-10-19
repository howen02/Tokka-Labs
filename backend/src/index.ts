import { Elysia } from 'elysia'
import { pollTransactions } from './services/pollTransactions'
import { getTransaction } from './controllers/fetchTransactionController'
import { queryTransactions } from './controllers/queryTransactionsController'
import cors from '@elysiajs/cors'

const app = new Elysia()
	.use(cors())
	.get('/transactions/', ({ query: { start, end } }) => {
		console.log('querying transactions', start, end, 'at', new Date())
		return queryTransactions(start, end)
	})
	.get('/transaction/:hash', ({ params: { hash } }) => getTransaction(hash))
	.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
pollTransactions()
