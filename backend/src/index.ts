import { Elysia } from "elysia";
import { pollTransactions} from "./services/pollTransactions";
import {fetchTransaction} from "./controllers/fetchTransactionController";
import {queryTransactions} from "./controllers/queryTransactionsController";

const app =
    new Elysia()
        .get("/transactions/:start&:end", ({ query: { start, end }}) => queryTransactions(start, end))
        .get("/transaction/:hash", ({ params: { hash } }) => fetchTransaction(hash))
        .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
pollTransactions();
