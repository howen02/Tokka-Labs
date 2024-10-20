import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Elysia } from "elysia";
import { getRecentTransactions } from './handlers/handleFetchTransactions';
import { getTransaction } from './handlers/handleFetchTransaction';

describe("Uniswap Transaction App", () => {
    let app: Elysia;
    let server: any;

    beforeAll(() => {
        app = new Elysia()
            .get("/transactions", ({ query }) => getRecentTransactions(
                parseInt(query.page as string) || 1,
                parseInt(query.pageSize as string) || 50
            ))
            .get("/transaction/:hash", getTransaction);

        server = app.listen(3000);
        console.log("Test server started on http://localhost:3000");
    });

    afterAll(() => {
        server.stop();
        console.log("Test server stopped");
    });

    it("should return recent transactions with pagination", async () => {
        console.log("\nTesting: GET /transactions");
        const response = await fetch("http://localhost:3000/transactions?page=1&pageSize=50");
        console.log(`Expected status: 200, Actual status: ${response.status}`);
        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('status', 200);
        expect(body).toHaveProperty('body');
        expect(body.body).toHaveProperty('message');
        expect(body.body).toHaveProperty('data');
        expect(Array.isArray(body.body.data)).toBe(true);
        expect(body.body.data.length).toBeLessThanOrEqual(50);

        console.log(`Number of transactions returned: ${body.body.data.length}`);
    });

    it("should return a specific transaction", async () => {
        console.log("\nTesting: GET /transaction/:hash");
        const transactionHash = "0x123";
        console.log(`Testing with transaction hash: ${transactionHash}`);

        const response = await fetch(`http://localhost:3000/transaction/${transactionHash}`);
        console.log(`Expected status: 200, Actual status: ${response.status}`);
        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body).toHaveProperty('status', 200);
        expect(body).toHaveProperty('body');
        expect(body.body).toHaveProperty('message');
        expect(body.body).toHaveProperty('data');

        expect(body.body.data).toBe(null);

        console.log(`Returned message: ${body.body.message}`);
    });
});