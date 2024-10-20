import {cron} from "@elysiajs/cron";
import {pollTransactions} from "./services/pollTransactions";

export const pollTransactionsCron =
    cron({
        name: 'poll-transactions',
        pattern: '*/5 * * * * *',
        run() {
            pollTransactions()
                .catch(err =>
                    console.error(
                        `[${new Date().toISOString()}] Error in transaction polling:`,
                        err
                    )
                )
        }
    })