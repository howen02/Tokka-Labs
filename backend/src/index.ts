import { Elysia } from "elysia";
import { pollTransactions} from "./services/pollTransactions";

const app =
    new Elysia()
        .get("/transctions", () => "Hello, Elysia!")
        .get("/tx/:hash", () => "Hello, Elysia!")
        .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
pollTransactions();
