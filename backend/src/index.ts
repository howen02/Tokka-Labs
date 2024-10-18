import { Elysia } from "elysia";
import { pollTransactions} from "./services/pollTransactions";
import {fetchTransaction} from "./controllers/fetchTransactionController";

const app =
    new Elysia()
        .get("/transctions", () => "Hello, Elysia!")
        .get("/tx/:hash", ({ params: { hash } }) => fetchTransaction(hash))
        .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
pollTransactions();
