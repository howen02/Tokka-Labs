import { describe, it, expect } from 'bun:test'

const API_BASE_URL = 'http://localhost:3000'

describe('Uniswap Transaction App', () => {
	it('should return recent transactions with pagination', async () => {
		console.log('\nTesting: GET /transactions')
		const response = await fetch(
			`${API_BASE_URL}/transactions?page=1&pageSize=50`
		)
		expect(response.status).toBe(200)

		const body = await response.json()

		expect(body).toHaveProperty('status', 200)
		expect(body).toHaveProperty('body')
		expect(body.body).toHaveProperty('message')
		expect(body.body).toHaveProperty('data')
		expect(Array.isArray(body.body.data)).toBe(true)
		expect(body.body.data.length).toBeLessThanOrEqual(50)
		expect(body.body.message).toMatch(/\d+ transaction\(s\) found/)
	})

	it('should return transactions from Oct 1 to Oct 2, 2024', async () => {
		console.log('\nTesting: GET /transactions/range')
		const startDate = new Date('2024-10-01T00:00:00Z').getTime()
		const endDate = new Date('2024-10-02T23:59:59Z').getTime()
		const response = await fetch(
			`${API_BASE_URL}/transactions/range?start=${startDate}&end=${endDate}&page=1&pageSize=50`
		)
		expect(response.status).toBe(200)

		const body = await response.json()

		expect(body).toHaveProperty('status', 200)
		expect(body).toHaveProperty('body')
		expect(body.body).toHaveProperty('message')
		expect(body.body).toHaveProperty('data')
		expect(Array.isArray(body.body.data)).toBe(true)
		expect(body.body.message).toMatch(/\d+ transaction\(s\) found/)
	}, 10000)

	it('should return a specific transaction', async () => {
		console.log('\nTesting: GET /transaction/:hash')
		const transactionHash =
			'0x5f13fb93b0ba6eda4f51c18300be2313a88e26fc4e63f93494a8f44a6c96b39a'
		console.log(`Testing with transaction hash: ${transactionHash}`)

		const response = await fetch(
			`${API_BASE_URL}/transaction/${transactionHash}`
		)
		expect(response.status).toBe(200)

		const body = await response.json()

		expect(body).toHaveProperty('status', 200)
		expect(body).toHaveProperty('body')
		expect(body.body).toHaveProperty('message')
		expect(body.body).toHaveProperty('data')
		expect(body.body.data).toHaveProperty('hash', transactionHash)
		expect(body.body.data).toHaveProperty('blockNumber')
		expect(body.body.data).toHaveProperty('gasUsed')
		expect(body.body.data).toHaveProperty('gasPrice')
		expect(body.body.data).toHaveProperty('timeStamp')
		expect(body.body.data).toHaveProperty('ethPrice')
	})

	it('should return an error for an invalid transaction hash', async () => {
		console.log('\nTesting: GET /transaction/:hash with invalid hash')
		const invalidHash = 'invalidhash'
		console.log(`Testing with transaction hash: ${invalidHash}`)

		const response = await fetch(
			`${API_BASE_URL}/transaction/${invalidHash}`
		)
		expect(response.status).toBe(200)

		const body = await response.json()

		expect(body).toHaveProperty('status', 404)
		expect(body).toHaveProperty('body')
		expect(body.body).toHaveProperty('message')
		expect(body.body.message).toBe('Transaction not found')
	})
})