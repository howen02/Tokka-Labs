import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';
import {
	getRecentTransactions,
	getTransactionsInTimeRange
} from './handlers/handleFetchTransactions';
import { getTransaction } from './handlers/handleFetchTransaction';
import { pollTransactionsCron } from './middleware';
import { SERVER_PORT } from './constants';
import { createClient } from 'redis';

const redisClient = createClient({
	url: `redis://${process.env.REDIS_HOST}:6379`
});
const instanceId = `instance_${Math.random().toString(36).substring(2, 10)}`;
const LEADER_KEY = 'leader';
const LEADER_TTL = 60; // Longer TTL since we aren't renewing

const app = new Elysia()
	.use(cors({
		origin: ['http://localhost:4173', 'http://frontend:4173', 'http://localhost:8080'],
	}))
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
	.get('/transaction/:hash', ({ params: { hash } }) => getTransaction(hash));

redisClient
	.connect()
	.then(() => {
		console.log('Connected to Redis.');
		return redisClient.set(LEADER_KEY, instanceId, { NX: true, EX: LEADER_TTL });
	})
	.then(result => {
		result
			? console.log('This instance is now the leader.')
			: console.log('This instance is a follower.');

		if (result) {
			app.use(pollTransactionsCron);
		}

		return app.listen(SERVER_PORT);
	})
	.then(() =>
		console.log(`Backend is running at ${app.server?.hostname}:${app.server?.port}`)
	)
	.catch(error => console.error('Error during setup:', error));
