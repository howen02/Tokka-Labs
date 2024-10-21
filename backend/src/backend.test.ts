import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { Elysia } from 'elysia'
import { getRecentTransactions } from './handlers/handleFetchTransactions'
import { getTransaction } from './handlers/handleFetchTransaction'

const TEST_PORT = 3030

describe('Uniswap Transaction App', () => {
	let app: Elysia
	let server: any

	beforeAll(() => {
		app = new Elysia()
			.get('/transactions', ({ query }) =>
				getRecentTransactions(
					parseInt(query.page as string) || 1,
					parseInt(query.pageSize as string) || 50
				)
			)
			.get('/transaction/:hash', getTransaction)

		server = app.listen(TEST_PORT)
		console.log(`Test server started on http://localhost:${TEST_PORT}`)
	})

	afterAll(() => {
		server.stop()
		console.log('Test server stopped')
	})

	it('should return recent transactions with pagination', async () => {
		console.log('\nTesting: GET /transactions')
		const response = await fetch(
			`http://localhost:${TEST_PORT}/transactions?page=1&pageSize=50`
		)
		console.log(`Expected status: 200, Actual status: ${response.status}`)
		expect(response.status).toBe(200)

		const body = await response.json()

		expect(body).toHaveProperty('status', 200)
		expect(body).toHaveProperty('body')
		expect(body.body).toHaveProperty('message')
		expect(body.body).toHaveProperty('data')
		expect(Array.isArray(body.body.data)).toBe(true)
		expect(body.body.data.length).toBeLessThanOrEqual(50)

		console.log(`Number of transactions returned: ${body.body.data.length}`)
	})

	it('should return a specific transaction', async () => {
		console.log('\nTesting: GET /transaction/:hash')
		const transactionHash =
			'0x5f13fb93b0ba6eda4f51c18300be2313a88e26fc4e63f93494a8f44a6c96b39a'
		console.log(`Testing with transaction hash: ${transactionHash}`)

		const response = await fetch(
			`http://localhost:${TEST_PORT}/transaction/${transactionHash}`
		)
		console.log(`Expected status: 200, Actual status: ${response.status}`)
		expect(response.status).toBe(200)

		const body = await response.json()

		expect(body).toHaveProperty('body')
		expect(body.body).toHaveProperty('message')
	})

	it("shouldn't return a transaction", async () => {
		console.log('\nTesting: GET /transaction/:hash')
		const transactionHash = 'invalidhash'
		console.log(`Testing with transaction hash: ${transactionHash}`)

		const response = await fetch(
			`http://localhost:${TEST_PORT}/transaction/${transactionHash}`
		)
		console.log(`Expected status: 200, Actual status: ${response.status}`)
		expect(response.status).toBe(200)

		const body = await response.json()

		expect(body).toHaveProperty('status', 500)
		expect(body).toHaveProperty('body')
		expect(body.body).toHaveProperty('message')
	})
})